//文章路由
import {
  putArticle,
  getArticleById,
  getAllArticles,
  getArticles,
  editeArticle,
  deleteArticle,
  changeArticleStatus,
  likeArticle,
} from '../controllers/article'
import { controller, put, del, post, get, required } from '../decorator/router'
import config from '../config'
import request from 'request'
import { resError, resSuccess } from '../utils/resHandle'
@controller(`${config.APP.ROOT_PATH}/article`)
export class articleController {
  //添加文章
  @post('add')
  @required({ body: ['title', 'tag', 'content', 'editContent', 'keyword', 'descript'] })
  async addArticle(ctx, next) {
    const opts = ctx.request.body;
    try {
      let article = await putArticle(opts);
      if (article) {
        // 百度 seo push
        request.post({
          url: `http://data.zz.baidu.com/urls?site=${config.BAIDU.site}&token=${config.BAIDU.token}`,
          headers: { 'Content-Type': 'text/plain' },
          body: `${config.INFO.site}/article/${article._id}`
        }, (error, response, body) => {
          console.log('推送结果：', body)
        })
        resSuccess({ ctx, message: '文章添加成功', result: article })
      } else {
        resError({ ctx, message: '文章添加失败' })
      }
    } catch (error) {
      console.log(error, '添加文章');
      resError({ ctx, message: '文章添加失败', error })
    }

  }
  //获取某篇文章
  @get('get/:id')
  async getArticleId(ctx, next) {
    const { id } = ctx.params;
    if (id) {
      try {
        const res = await getArticleById(id);
        if (!res) {
          throw Error('该文章不存在');
          return;
        }
        resSuccess({ ctx, message: '查询文章成功', result: res })
      } catch (err) {
        resError({ ctx, message: '查询文章失败', err })
      }
    } else {
      resError({ ctx, message: '查询文章失败', err: '缺少参数id' })
    }
  }
  // 获取文章集合
  @get('getAll')
  async getAllArticle(ctx, next) {
    const res = await getAllArticles()
    resSuccess({ ctx, message: '获取文章成功', result: res })
  }
  //获取分页文章
  @get('get')
  async getArticle(ctx, next) {
    const opts = ctx.query || {};
    const res = await getArticles(opts)
    resSuccess({ ctx, message: '查询文章成功', result: res })

  }
  //编辑文章
  @post('edite/:id')
  async toEditeArticle(ctx, next) {
    const { id } = ctx.params;
    if (id) {
      try {
        const res = await editeArticle(id, ctx.request.body);
        resSuccess({ ctx, message: '修改文章成功' });
      } catch (error) {
        resError({ ctx, message: '修改文章失败', error })
      }
    } else {
      resError({ ctx, message: '编辑文章失败', err: '缺少参数id' })
    }
  }
  //删除文章
  @del('delete/:id')
  async removeArticle(ctx, next) {
    const { id } = ctx.params;
    if (id) {
      try {
        const res = await deleteArticle(id);
        resSuccess({ ctx, message: '删除文章成功' })
      } catch (error) {
        resError({ ctx, message: '删除文章失败', err: err })
      }
    } else {
      resError({ ctx, message: '删除文章失败', err: '缺少参数id' })
    }
  }
  //修改文章状态
  @put('status/:id')
  async toChangeArticle(ctx, next) {
    const { id } = ctx.params
    if (id) {
      try {
        const res = await changeArticleStatus(id, ctx.request.body)
        resSuccess({ ctx, message: '修改文章状态成功' })
      } catch (err) {
        resError({ ctx, message: '修改文章状态失败', err: err })
      }
    } else {
      resError({ ctx, message: '修改文章状态失败', err: '地址缺少参数id' })
    }
  }
  // 点赞
  @post('like/:id')
  async toChangeArticle(ctx, next) {
    const { id } = ctx.params
    if (id) {
      try {
        const res = await likeArticle(id)
        resSuccess({ ctx, message: '修改成功' })
      } catch (err) {
        resError({ ctx, message: '修改失败', err: err })
      }
    } else {
      resError({ ctx, message: '修改失败', err: '地址缺少参数id' })
    }
  }

}
