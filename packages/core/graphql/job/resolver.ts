import tscore, { IResolvers } from "@ts.app/core"
import { GraphqlContext, GraphqlRouter, StreamListener } from "@ts.app/core/common/service.js"
import * as j from "@ts.app/core/models/job.js"

const config = tscore.config
export const router = new GraphqlRouter<IResolvers<GraphqlContext>>()

const job_stream = j.JobModel.watch<j.JobDocument<any>>([])
const job_exec_action_stream = j.JobActionModel.watch<j.JobActionDocument>([])

const job_stream_listener = new StreamListener<j.JobDocument<any>>(job_stream)
const job_action_stream_listener = new StreamListener<j.JobActionDocument>(job_exec_action_stream)
  
router.resolvers.Subscription.streamJob = {
    resolve: {
        subscribe: async function* ( parent, args, context, info ): AsyncGenerator<any, any, any> {
            while(true) {
                const data = await job_stream_listener.listener
                const operation = job_stream_listener.getOperation(args.stream.operations, data.operationType)
                if(operation) yield job_stream_listener.yield("streamJob", data)
            }
        }
    }
}

router.resolvers.Subscription.streamJobAction = {
    resolve: {
        subscribe: async function* ( parent, args, context, info ): AsyncGenerator<any, any, any> {
            while(true) {
                const data = await job_action_stream_listener.listener
                const operation = job_action_stream_listener.getOperation(args.stream.operations, data.operationType)
                if(operation) yield job_action_stream_listener.yield("streamJobExecAction", data)
            }
        }
    }
}