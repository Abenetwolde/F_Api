// orderController.ts
import { Request, Response } from 'express';
import Order from '../model/order.model';
import Product from '../model/food.model';
const generateUniqueID = () => {
    return Math.floor(1000 + Math.random() * 9000);
};

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { user, items, note, totalAmount, deliveryAddress, deliveryDate, status, payment } = req.body;

        const newOrder = new Order({
            user,
            items,
            note,
            totalAmount,
            deliveryAddress,
            deliveryDate,
            status,
            payment,
        });
        const uniqueID = generateUniqueID();
        newOrder.orderId = uniqueID;
        const savedOrder = await newOrder.save();
        // Assuming payment is successful, update product count
        await Promise.all(
            items.map(async (item: any) => {
                const product = await Product.findById(item.product);

                if (product) {
                    product.orderQuantity += item.quantity;
                    await product.save();
                }
            })
        );

        res.status(201).json({ success: true, order: savedOrder });
        res.status(201).json({ success: true, order: savedOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getOrders = async (req: Request, res: Response) => {
    try {
        // Define the base filter
        let filter: any = {};

        // Apply search filter if provided in the query parameters
        if (typeof req.query.search === 'string') {
            filter.orderId = { $regex: req.query.search, $options: 'i' };
        }

        // Define the sorting criteria based on the 'sortBy' query parameter
        let sortQuery: any;
        switch (req.query.sortBy) {
            case 'latest':
                sortQuery = { createdAt: -1 };
                break;
            case 'oldest':
                sortQuery = { createdAt: 1 };
                break;
            default:
                sortQuery = {};
        }

        // Parse the page and pageSize query parameters
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10; // Adjust the default page size as needed

        // Calculate the number of orders to skip
        const skip = (page - 1) * pageSize;

        // Find the orders for the current page
        const orders = await Order.find(filter)
            .populate('user')
            .populate('payment')
            .skip(skip)
            .limit(pageSize)
            .sort(sortQuery);

        // Count the total number of orders
        const count = await Order.countDocuments(filter);

        // Calculate the total number of pages
        const totalPages = Math.ceil(count / pageSize);

        res.status(200).json({
            success: true,
            orders,
            count,
            page,
            pageSize,
            totalPages,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error!' });
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId).populate('user').populate('payment').exec();

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateOrderById = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.orderId;
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { ...req.body },
            { new: true }
        ).populate('user').populate('payment').exec();

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteOrderById = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.orderId;
        const deletedOrder = await Order.findByIdAndDelete(orderId).populate('user').populate('payment').exec();

        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, order: deletedOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getOrdersByStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.params;
        const orders = await Order.find({ status }).populate('user').populate('payment').exec();

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getOrdersByUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ user: userId }).populate('user').populate('payment').exec();

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getOrdersByDateRange = async (req: Request, res: Response) => {
    try {
        // const { startDate, endDate } = req.query;
        const startDateParam = req.query.startDate as string;
        const endDateParam = req.query.endDate as string;

        // Check if both startDateParam and endDateParam are valid dates
        const startDate = startDateParam ? new Date(startDateParam) : null;
        const endDate = endDateParam ? new Date(endDateParam) : null;

        // Check if the dates are valid before using them in the query
        const dateFilter: Record<string, any> = {};
        if (startDate && !isNaN(startDate.getTime())) {
            dateFilter.$gte = startDate;
        }

        if (endDate && !isNaN(endDate.getTime())) {
            dateFilter.$lte = endDate;
        }

        const orders = await Order.find({
            deliveryDate: dateFilter,
        }).populate('user').populate('payment').exec();

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getPaginatedOrders = async (req: Request, res: Response) => {
    try {
        const { page, pageSize } = req.query;
        const orders = await Order.find()
            .populate('user')
            .populate('payment')
            .skip(Number(page) * Number(pageSize))
            .limit(Number(pageSize))
            .exec();

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getOrdersByTotalAmountRange = async (req: Request, res: Response) => {
    try {
        const { minTotalAmount, maxTotalAmount } = req.query;
        const orders = await Order.find({
            totalAmount: { $gte: Number(minTotalAmount), $lte: Number(maxTotalAmount) },
        }).populate('user').populate('payment').exec();

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getOrderCount = async (req: Request, res: Response) => {
    try {
        const count = await Order.countDocuments();

        res.status(200).json({ success: true, count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
