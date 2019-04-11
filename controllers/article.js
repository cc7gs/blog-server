import Article from '../models/article';

/**
 * 添加文章
 * @param {*} opts 
 */
export const putArticle = async (opts) => {
  let article = null;
  if (opts) {
    article = await (new Article(opts)).save();
  }
  return article;
}
/**
 * 通过id 查询文章
 * @param {*} id 
 */
export const getArticleById = async (id) => {
  let res = await Article.findById(id).populate('tag');
  if (res) {
    //每次请求views +1
    res.meta.views += 1;
    res = await res.save();
  }
  return res;
}
/**
 * 查询所有文章(公开与发布的)
 * 按时间归档
 */
export const getAllArticles = async () => {
  // //配置分页参数
  // const current_age = 1
  // const page_size = 10000;
  // const options = {
  //   sort: { creat_at: -1 },
  //   page: Number(current_age),
  //   limit: Number(page_size),
  //   populate: ['tag'],
  //   select: '-content'
  // }

  //过滤文章参数(显示 公开和发布的文章)
  const querys = {
    state: 1,
    publish: 1
  }
  //查询
  const article = await Article.aggregate([
    { $match: querys },
    {
      $project: {
        year: { $year: '$create_at' },
        month: { $month: '$create_at' },
        title: 1,
        create_at: 1
      }
    },
    {
      //按时间分组
      $group: {
        _id: {
          year: '$year',
          month: '$month'
        },
        article: {
          $push: {
            title: '$title',
            _id: '$_id',
            create_at: '$create_at'
          }
        }
      }
    }]);
  if (article) {
    let yearList = [...new Set(article.map(item => item._id.year))].map(item => {
      let monthList = []
      article.forEach(n => {
        // 同一年
        if (n._id.year === item) {
          monthList.push({ month: n._id.month, articleList: n.article.reverse() })
        }
      })
      return { year: item, monthList }
    })
    return yearList
  } else {
    return []
  }
}
/**
 * 修改文章
 * @param {文章id} id 
 * @param {修改内容} opt 
 */
export const editeArticle = async (id, opt) => {
  return await Article.findByIdAndUpdate(id, opt)
}
/**
 * 通过id 删除文章
 * @param {*} id 
 */
export const deleteArticle = async (id) => {
  return await Article.findByIdAndDelete(id);
}
/**
 * 修改文章状态
 * @param {*} id 
 * @param {*} opts 
 */
export const changeArticleStatus = async (id, opts) => {
  const { status, publish } = opts;
  const querys = {};
  if (status) {
    querys.status = status;
  }
  if (publish) {
    querys.publish = publish;
  }
  return await Article.findByIdAndUpdate(id, querys);
}

/**
 * 点赞
 * @param {文章id} id 
 */
export const likeArticle = async (id) => {
  let res = await Article.findById(_id)
  if (res) {
    // 每次请求，views 都增加一次
    res.meta.likes += 1
    res = await res.save()
  }
  return res
}

/**
 * 分页获取文章
 * @param {*} opts 
 */
export const getArticles = async (opts) => {
  const {
    current_page = 1,
    page_size = 10,
    keyword = '',
    state = 1,
    publish = 1,
    tag,
    type,
    date,
    hot } = opts

  // 过滤条件
  const options = {
    sort: { create_at: -1 },
    page: Number(current_page),
    limit: Number(page_size),
    populate: ['tag'],
    select: '-content'
  }
  // 参数
  const querys = {}

  // 关键词查询
  if (keyword) {
    const keywordReg = new RegExp(keyword)
    querys['$or'] = [
      { 'title': keywordReg },
      { 'content': keywordReg },
      { 'description': keywordReg }
    ]
  }

  // 按照state查询
  if (['1', '2'].includes(state)) {
    querys.state = state
  }

  // 按照公开程度查询
  if (['1', '2'].includes(publish)) {
    querys.publish = publish
  }

  // 按照类型程度查询
  if (['1', '2', '3'].includes(type)) {
    querys.type = type
  }

  // 按热度排行
  if (hot) {
    options.sort = {
      'meta.views': -1,
      'meta.likes': -1,
      'meta.comments': -1
    }
  }

  // 时间查询
  if (date) {
    const getDate = new Date(date)
    if (!Object.is(getDate.toString(), 'Invalid Date')) {
      querys.create_at = {
        "$gte": new Date((getDate / 1000 - 60 * 60 * 8) * 1000),
        "$lt": new Date((getDate / 1000 + 60 * 60 * 16) * 1000)
      }
    }
  }
  if (tag) querys.tag = tag

  // 如果是前台请求，则重置公开状态和发布状态
  //   if (!authIsVerified(ctx.request)) {
  // 	querys.state = 1
  // 	querys.publish = 1
  //   }
  // 查询
  const result = await Article.paginate(querys, options)
  if (result) {
    return {
      pagination: {
        total: result.total,
        current_page: result.page,
        total_page: result.pages,
        page_size: result.limit
      },
      list: result.docs
    }
  } else {
    return false
  }
}