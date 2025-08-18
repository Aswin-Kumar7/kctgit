import { Router, Request, Response } from 'express';
import { menuItems } from '../data/menu';
import { ApiResponse, MenuItem } from '../types';

const router = Router();

// GET /api/menu - Get all menu items
router.get('/', (req: Request, res: Response<ApiResponse<MenuItem[]>>): void => {
	try {
		const { category, vegetarian } = req.query;
		let filteredItems = [...menuItems];
		if (category && typeof category === 'string') {
			filteredItems = filteredItems.filter(item => item.category === category);
		}
		if (vegetarian === 'true') {
			filteredItems = filteredItems.filter(item => item.isVegetarian);
		}
		res.json({ success: true, data: filteredItems, message: 'Menu items retrieved successfully' });
	} catch (error) {
		res.status(500).json({ success: false, error: 'Failed to retrieve menu items' });
	}
});

// GET /api/menu/categories - Get all available categories
router.get('/categories', (req: Request, res: Response<ApiResponse<string[]>>): void => {
	try {
		const categories = [...new Set(menuItems.map(item => item.category))];
		res.json({ success: true, data: categories, message: 'Categories retrieved successfully' });
	} catch (error) {
		res.status(500).json({ success: false, error: 'Failed to retrieve categories' });
	}
});

// GET /api/menu/:id - Get specific menu item
router.get('/:id', (req: Request, res: Response<ApiResponse<MenuItem>>): void => {
	try {
		const { id } = req.params;
		const menuItem = menuItems.find(item => item.id === id);
		if (!menuItem) {
			res.status(404).json({ success: false, error: 'Menu item not found' });
			return;
		}
		res.json({ success: true, data: menuItem, message: 'Menu item retrieved successfully' });
	} catch (error) {
		res.status(500).json({ success: false, error: 'Failed to retrieve menu item' });
	}
});

export default router;
