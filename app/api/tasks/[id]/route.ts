import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Task from '../../../../models/Task';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { status } = await req.json();

  try {
    await connectToDatabase();
    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    task.status = status;
    await task.save();
    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await connectToDatabase();
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
