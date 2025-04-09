import { Connection as RabbitmqConnection, Channel, Message, Replies } from "amqplib/callback_api.js"
import { Types } from "mongoose"
import { ConsumerInput } from "@ts.app/core/models/config/consumer.js"
import { ChannelConfigDocument, ChannelConfigModel } from "@ts.app/core/models/config/channel.js"
import { Connection } from "@ts.app/core/common/rabbitmq/connection.js"
import { TypeStack } from "@ts.app/core/common/cli/typestack"

export type ConsumerOnMessage = ( msg: Message | null ) => void

export type ConsumerCallback = ( err: any, ok: Replies.Consume ) => void

export type OnMessage = ( channel: Channel, channel_config: ChannelConfigDocument, consumer: ConsumerInput ) => Promise<ConsumerOnMessage>

export function parseData<T>(buffer: Buffer): T | null {
    try {
        return JSON.parse(buffer.toString()) as T
    } catch (error) {
        return null
    }
}

export class ConsumerList {
    private consumers: Consumer[]
    
    constructor( ) {
        this.consumers = []
    }

    public async initilize(conn: RabbitmqConnection) {
        // foreach config.consumer_services
        for await(const service of TypeStack.rcs) {
            await this.initilizeConsumers(conn, service)
        }
    }

    private async initilizeConsumers(conn: RabbitmqConnection, service:string) {
        // find all channels in services array
        const channels = await ChannelConfigModel.find({ "data.services": service })
        for await(const channel_config of channels) {
            const consumer_channel = await Connection.newChannel(conn, channel_config.data.options)
            await this.newQueue(consumer_channel, channel_config)

            for await(const consumer of channel_config.data.consumers) {
                await this.addConsumer(consumer_channel, channel_config, consumer)
            }
        }
    }

    // create queue for consumers
    private async newQueue(channel: Channel, channel_config: ChannelConfigDocument) {
        // console.log(`Info, creating new queue id: ${channel_config._id.toString()}`)
        return new Promise<void>((resolve) => {
            channel.assertQueue( channel_config._id.toString(), channel_config.data?.options?.queue, (err: any, ok: Replies.AssertQueue) => {
                if(err) throw `${err}`
                resolve()
            }) 
        })
    }

    public async addConsumer( channel: Channel, channel_config: ChannelConfigDocument, consumer: ConsumerInput ): Promise<Consumer> {
        const _consumer = this.getConsumer(consumer._id)
        if( _consumer ) return _consumer

        const res = await Consumer.newConsumer(channel, channel_config, consumer)
        this.consumers.push(res)
        return res
    }

    private getConsumer( consumer_id: Types.ObjectId ): Consumer | null  {
        for(const consumer of this.consumers) {
            if(consumer.consumerIdEqual(consumer_id)) {
                return consumer
            }
        }
        return null
    }

    public async removeConsumer( channel:Channel, consumer_id: Types.ObjectId ) {
        const consumer = this.getConsumer(consumer_id)
        if(consumer) {
            channel.cancel(consumer.tag.consumerTag, (error) => {
                if(error) throw `${error}`
                this.consumers = this.consumers.filter((consumer) => !consumer.consumerIdEqual(consumer_id))
            })
        }
    }

    async recconectConsumers(conn: RabbitmqConnection, any_channel: Channel): Promise<void> {
        // remove all consumers
        for await(const consumer of this.consumers) {
            await this.removeConsumer(any_channel, consumer.getConsumer._id)
            .catch(err => `Warning, recconectConsumers removeConsumer id: ${consumer.getConsumer._id}: ${err}`)
        }
        this.consumers = []
        await this.initilize(conn)
    }
}

export class Consumer {
    private channel_config: ChannelConfigDocument
    private consumer: ConsumerInput
    public tag: Replies.Consume

    private constructor(tag: Replies.Consume, channel_config: ChannelConfigDocument, consumer: ConsumerInput) {
        this.tag = tag
        this.channel_config = channel_config
        this.consumer = consumer
    }

    public get getChannelConfig() {
        return this.channel_config
    }

    public get getConsumer() {
        return this.consumer
    }

    public consumerIdEqual(_id: Types.ObjectId): boolean {
        return _id.equals(this.consumer._id)
    }

    static async newConsumer( channel: Channel, channel_config: ChannelConfigDocument, consumer: ConsumerInput ): Promise<Consumer> {
        const onMessage = await Consumer.getOnMessage(channel, channel_config, consumer)
        return new Promise<Consumer>((resolve) => {
            const queue_id = channel_config._id.toString()
            channel.consume( queue_id, onMessage, consumer.options,
                ( error2, tag: Replies.Consume ) => {
                    if(error2) throw error2
                    resolve(new Consumer(tag, channel_config, consumer))
                }
            )
        })
    }

    static async getOnMessage( channel: Channel, channel_config: ChannelConfigDocument, consumer: ConsumerInput ): Promise<ConsumerOnMessage> {
        const _import = await import(channel_config.data.path)
        const OnMessage = _import.onMessage as OnMessage;
        return await OnMessage(channel, channel_config, consumer)
    }
}