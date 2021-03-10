#!/usr/bin/env node

const chalk = require('chalk')
const ora = require('ora')
const request = require('request')
const isChinese = require('is-chinese')
const urlencode = require('urlencode')
const noCase = require('no-case')
const cheerio = require('cheerio')

const spinner = ora('Loading...')

let word = process.argv.slice(2).join(' ') // 获取命令行输入的参数

if (!word) {
  spinner.fail(chalk.red('Please enter text'))
  process.exit() // Stop the process
}
console.log(word)

const isCh = isChinese(word)
word = isCh ? word : noCase.noCase(word)
const url = () => {
  return isCh ? 'https://dict.youdao.com/w/eng/' : 'https://dict.youdao.com/w/'
}

const option = {
  url: url() + urlencode(word),
}

spinner.start()

request(option.url, (error, response, body) => {
  if (error) {
    spinner.fail(chalk.red('ERROR'))
  } else {
    spinner.stop()

    const $ = cheerio.load(body)
    let result = $('#phrsListTab > .trans-container > ul')
      .text()
      .replace(/\s+/g, '')

    if (!result) {
      // console.log(
      //   $('#ydTrans > #fanyiToggle > .trans-container > p:nth-child(2)').text()
      // )
      result = $(
        '#ydTrans > #fanyiToggle > .trans-container > p:nth-child(2)'
      ).text()
    }
    console.log(chalk.green(result))
  }
})
