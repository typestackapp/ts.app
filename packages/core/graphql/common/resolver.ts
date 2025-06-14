import { GraphqlContext, GraphqlRouter } from "@ts.app/core"
import { IResolvers } from "@ts.app/core"

export const router = new GraphqlRouter<IResolvers<GraphqlContext>>()

