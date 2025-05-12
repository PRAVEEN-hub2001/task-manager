import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Task from '../../../models/Task';

export async function GET() {
  try {
    await connectToDatabase();
    const tasks = await Task.find();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { title, description } = await request.json();
    const newTask = new Task({ title, description });
    await newTask.save();
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
