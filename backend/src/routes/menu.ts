import { Router, Request, Response } from 'express';
import { menuItems } from '../data/menu'; // used for seeding and backwards compatibility
import { ApiResponse } from '../types';
import MenuItemModel, { IMenuItem } from '../models/MenuItem';
import { AuthenticatedRequest } from '../middleware/auth';
import multer from 'multer';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

const router = Router();

// multer memory storage for small images
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Admin-only helper
const adminEmail = 'admin@kore.com';
function adminOnly(req: Request, res: Response, next: any) {
	if ((req as any).user?.email === adminEmail) return next();
	return res.status(403).json({ success: false, error: 'Admin access only' });
}

// GET /api/menu - Get all menu items
router.get('/', async (req: Request, res: Response<ApiResponse<IMenuItem[]>>): Promise<void> => {
    try {
        const { category, vegetarian } = req.query;
        const q: any = {};
        if (category && typeof category === 'string') q.category = category;
        if (vegetarian === 'true') q.isVegetarian = true;
        const items = await MenuItemModel.find(q).sort({ createdAt: -1 }).lean().exec();
        res.json({ success: true, data: items, message: 'Menu items retrieved successfully' });
    } catch (error) {
        console.error('Get menu error', error);
        res.status(500).json({ success: false, error: 'Failed to retrieve menu items' });
    }
});

// GET /api/menu/categories - Get all available categories
router.get('/categories', async (req: Request, res: Response<ApiResponse<string[]>>): Promise<void> => {
    try {
        const categories = await MenuItemModel.distinct('category').exec();
        res.json({ success: true, data: categories as string[], message: 'Categories retrieved successfully' });
    } catch (error) {
        console.error('Categories error', error);
        res.status(500).json({ success: false, error: 'Failed to retrieve categories' });
    }
});

// GET /api/menu/:id - Get specific menu item
router.get('/:id', async (req: Request, res: Response<ApiResponse<IMenuItem>>): Promise<void> => {
    try {
        const { id } = req.params;
        const item = await MenuItemModel.findById(id).lean().exec();
        if (!item) {
            res.status(404).json({ success: false, error: 'Menu item not found' });
            return;
        }
        res.json({ success: true, data: item as IMenuItem, message: 'Menu item retrieved successfully' });
    } catch (error) {
        console.error('Get menu item error', error);
        res.status(500).json({ success: false, error: 'Failed to retrieve menu item' });
    }
});

// POST /api/menu - Create a new menu item (admin only)
router.post('/', adminOnly, async (req: AuthenticatedRequest, res: Response<ApiResponse<IMenuItem>>) => {
    try {
        const body = req.body as Partial<IMenuItem>;
        if (!body || !body.name || typeof body.price !== 'number') {
            res.status(400).json({ success: false, error: 'Invalid menu item' });
            return;
        }
        const doc = new MenuItemModel({
            name: body.name,
            description: body.description,
            price: body.price,
            category: body.category,
            isVegetarian: !!body.isVegetarian,
            imageId: body.imageId,
        });
        await doc.save();
        res.status(201).json({ success: true, data: doc.toObject() as IMenuItem, message: 'Menu item created' });
    } catch (error) {
        console.error('Create menu error', error);
        res.status(500).json({ success: false, error: 'Failed to create menu item' });
    }
});

// POST /api/menu/upload - upload image to MongoDB GridFS (admin only)
router.post('/upload', adminOnly, upload.single('file'), async (req: any, res: Response) => {
	try {
		if (!req.file) {
			res.status(400).json({ success: false, error: 'No file uploaded' });
			return;
		}
		// ensure mongoose connection db exists
		const db = mongoose.connection.db as any;
		if (!db) {
			res.status(500).json({ success: false, error: 'Database not connected' });
			return;
		}

		const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'menuImages' });
		const filename = `${Date.now()}_${req.file.originalname}`;
		const uploadStream = bucket.openUploadStream(filename, { contentType: req.file.mimetype });
		uploadStream.end(req.file.buffer);
		uploadStream.on('finish', (file: any) => {
			const fileId = file._id.toString();
			// return a URL that can be used to fetch the image
			const url = `/api/menu/image/${fileId}`;
			res.status(201).json({ success: true, data: { id: fileId, url }, message: 'Uploaded' });
			return;
		});
		uploadStream.on('error', (err: Error) => {
			console.error('GridFS upload error', err);
			res.status(500).json({ success: false, error: 'Failed to store file' });
			return;
		});
	} catch (error) {
		console.error('Upload error', error);
		res.status(500).json({ success: false, error: 'Upload failed' });
		return;
	}
});

// GET /api/menu/image/:id - stream image from GridFS
router.get('/image/:id', async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		if (!id) {
			res.status(400).send('Missing id');
			return;
		}
		const db = mongoose.connection.db as any;
		if (!db) {
			res.status(500).send('DB not connected');
			return;
		}
		const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'menuImages' });
		let objectId: ObjectId;
		try {
			objectId = new ObjectId(id);
		} catch (e) {
			res.status(400).send('Invalid id');
			return;
		}
		const download = bucket.openDownloadStream(objectId);
		download.on('error', (err: any) => {
			console.error('GridFS download error', err);
			try { res.status(404).send('Not found'); } catch {}
			return;
		});
		download.pipe(res);
		return;
	} catch (error) {
		console.error('Image stream error', error);
		res.status(500).send('Failed to stream');
		return;
	}
});

// PUT /api/menu/:id - Update menu item (admin only)
router.put('/:id', adminOnly, async (req: AuthenticatedRequest, res: Response<ApiResponse<IMenuItem>>) => {
    try {
        const { id } = req.params;
        const update = req.body as Partial<IMenuItem>;
        const updated = await MenuItemModel.findByIdAndUpdate(id, update, { new: true }).lean().exec();
        if (!updated) {
            res.status(404).json({ success: false, error: 'Menu item not found' });
            return;
        }
        res.json({ success: true, data: updated as IMenuItem, message: 'Menu item updated' });
        return;
    } catch (error) {
        console.error('Update menu error', error);
        res.status(500).json({ success: false, error: 'Failed to update menu item' });
        return;
    }
});

// DELETE /api/menu/:id - Delete menu item (admin only)
router.delete('/:id', adminOnly, async (req: AuthenticatedRequest, res: Response<ApiResponse<null>>) => {
    try {
        const { id } = req.params;
        const removed = await MenuItemModel.findByIdAndDelete(id).exec();
        if (!removed) {
            res.status(404).json({ success: false, error: 'Menu item not found' });
            return;
        }
        res.json({ success: true, data: null, message: 'Menu item deleted' });
        return;
    } catch (error) {
        console.error('Delete menu error', error);
        res.status(500).json({ success: false, error: 'Failed to delete menu item' });
        return;
    }
});

export default router;
