import { NextRequest, NextResponse } from 'next/server';
import schema from './schema';
import dbConnect from '@/app/lib/dbConnect';
import Product from '@/app/models/Product';


// JSON example for this endpoint
// {
//     "name": "Classic White T-Shirt",
//     "price": 19.99,
//     "description": "A classic white t-shirt made from 100% cotton, perfect for everyday wear.",
//     "category": "Clothing",
//     "material": "Cotton",
//     "image_url": "https://example.com/images/classic-white-tshirt.jpg",
//     "size": "M",
//     "color": "White",
//     "quantity_in_stock": 150
// }

export async function GET(request: NextRequest){
    try {
        await dbConnect();

        const products = await Product.find({});
        return NextResponse.json(products);
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500 })
        }

        return NextResponse.json({ error: 'An Unkown error occurred' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const validation = schema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(validation.error.errors, { status: 400 })
        }

        const checkProduct = await Product.findOne({ name: body.name });

        if (checkProduct) {
            return NextResponse.json({ error: 'Product already exits' }, { status: 409 })
        }

        const newProduct = new Product(body);
        await newProduct.save();

        return NextResponse.json(newProduct, { status: 201 });

    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500 })
        }

        return NextResponse.json({ error: 'An Unkown error occurred' }, { status: 500 })
    }
}