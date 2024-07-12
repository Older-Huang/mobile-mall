// app/controller/home.js
const Controller = require('egg').Controller;
const { codeMap: statusCode, errorRep, isSuccess } = require('../public/common');
const fs = require('node:fs/promises');
const path = require('path');
const { address } = require('../public/addressCache');
const getRandom = require('../public/rendom');
const mysql = require('mysql');
const { statfsSync } = require('node:fs');
const { encrypt, dencrypt } = require('../public/crypt');
class HomeController extends Controller {
  async index() {
    const { ctx, app } = this;
    // const files = await fs.readdir(path.resolve(__dirname, '../public'));
    // const buffer = await fs.readFile(path.resolve(__dirname, `../public/D9C1A28FF46533CA87569A9CCE2F32BF.webp`));
    // const result = await this.app.mysql.insert('img', { img: buffer });
    // console.log(result);
 
    // const results = await this.app.mysql.select('product');
    // results && results.forEach(async item => {
    //     const { name, cover, price } = item
    //     const res = await this.app.mysql.insert('product', { name, cover, price });
    //     console.log(res);
    // });
    
    return ''; 
  }

  async product() {
    const { ctx, app } = this;
    const { page, size, key } = ctx.query;
    const limit = Number(size) || 20;
    const offset = page - 1 > 0 ? (page - 1) * limit : 0;
    let name = key || null;

    let result;
    let totalCount;
    if (!name) {
      result = await app.mysql.select('product', { limit, offset });
      totalCount = await this.app.mysql.count('product');
    } else {
        const str = mysql.escape(key).slice(1);
        name = str.slice(0, str.length - 1);
        const sql = `SELECT * FROM product 
                    WHERE name LIKE '%${name}%'
                    LIMIT ?, ?;`
        const queryTotalSql = `SELECT COUNT(*) FROM product WHERE name LIKE '%${name}%'`;
        result = await app.mysql.query(sql, [offset, limit]);
        const totalResult = await app.mysql.query(queryTotalSql);
        if (totalResult) {
          totalCount = totalResult.length ? totalResult[0]['COUNT(*)'] : 0;
        }
    }

    if (!result) {
        return errorRep;
    }
    if (totalCount) {
        totalCount = totalCount % size > 0 ? Math.floor(totalCount / size) + 1 : Math.floor(totalCount / size);
    }

    return {
        code: statusCode.SUCCESS,
        message: '',
        data: {
            productList: result,
            totalPages: totalCount || 1,
        },
    };
  }

  async img() {
    const { ctx, app } = this;
    const { id } = ctx.query;

    if (!id) {
        return errorRep;
    }
    const result = await app.mysql.get('img', { id });

    if (!result) {
        return errorRep;
    }
    ctx.type = 'image/webp';

    return result.img;
  }

  async country() {
    return {
      code: statusCode.SUCCESS,
      message: '',
      data: {
        address
      },
    };
  }

  async productInfo() {
    const { ctx, app } = this;
    const { id } = ctx.query;
    
    if (!id) {
        return errorRep;
    }
    
    let result = await app.mysql.get('product_info', { id });
    if (!result) {
        return errorRep;
    }
    const { imgList, detailImgList, properties } = result;
    result = {
      ...result,
      imgList: JSON.parse(imgList),
      detailImgList: JSON.parse(detailImgList),
      properties: JSON.parse(properties),
    }

    return {
      code: statusCode.SUCCESS,
      message: '',
      data: {
        data: result,
      },
    };
  }
}

module.exports = HomeController;
