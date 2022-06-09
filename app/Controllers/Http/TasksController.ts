import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Task from 'App/Models/Task'

export default class TasksController {
  public async index({ view }: HttpContextContract) {
    const tasks = await Task.all()

    return view.render('tasks/index', { tasks })
  }

  public async store({ request, response, session }: HttpContextContract) {
    const validationSchema = schema.create({
      title: schema.string({ trim: true }, [rules.maxLength(255)]),
    })

    const validatedData = await request.validate({
      schema: validationSchema,
      messages: {
        'title.required': 'Enter tasks title',
        'title.maxLength': 'Task title can not exceed 255 characters',
      },
    })

    await Task.create({
      title: validatedData.title,
    })

    session.flash('notification', 'Task added!')

    return response.redirect('back')
  }
  public async update({ request, response, session, params }: HttpContextContract) {
    const task = await Task.findOrFail(params.id)

    task.isCompleted = !!request.input('completed')
    await task.save()

    session.flash('notification', 'Task updated!')

    return response.redirect('back')
  }
  public async destroy({ response, session, params }: HttpContextContract) {
    const task = await Task.findOrFail(params.id)

    await task.delete()

    session.flash('notification', 'Task deleted!')

    return response.redirect('back')
  }
}
