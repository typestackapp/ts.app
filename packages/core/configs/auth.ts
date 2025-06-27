import { AuthOptions } from "next-auth"
import { mongo } from "@ts.app/core/configs/env.js";

export default {
  secret: process.env.SECRET,
  providers: []
} satisfies AuthOptions