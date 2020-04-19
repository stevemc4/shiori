import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'

import Resolver from '../../class/Resolver'
import WikipediaAPIResponse from '../../class/WikipediaAPIResponse'

const Define = new Resolver('define', async (message: Message, args: string[]) => {
  if (args.length === 0) {
    message.channel.send('You need to insert something to search!')
  } else {
    const query = encodeURI(args.join(' '))
    const { data: searchResult } = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&utf8=&format=json`)
    if (searchResult.query.search.length === 0) {
      message.channel.send(`Can't find \`${query}\` in Wikipedia. Please try again`)
      return
    }
    const { data } = await axios.get(`https://en.wikipedia.org/w/api.php?&action=query&prop=extracts|info&exsentences=3&titles=${searchResult.query.search[0].title}&format=json&inprop=url&explaintext=true&exlimit=1&exintro=true`)
    const page: WikipediaAPIResponse = Object.values(data.query.pages)[0] as WikipediaAPIResponse
    const resultMessage = new MessageEmbed()
      .setColor('#ffaaa5')
      .setTitle(page.title)
      .setURL(page.fullurl)
      .setDescription(page.extract)
      .setFooter('Content from Wikipedia')
    message.channel.send(resultMessage)
  }
}, 'Get a definition of something from Wikipedia')

export default [
  Define
]