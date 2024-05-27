import { Effect, Data } from "effect"

class MyLovelyError extends Data.TaggedError("MyLovelyError")<{
  count: number
}>{
}

class MyIHateThisError extends Data.TaggedError("MyIHateThisError")<{}>{
}

const main = Effect.gen(function* () {
  yield* Effect.log("Welcome to the Effect Playground!")

  if (Math.random() > 0.5) {
    return yield* new MyLovelyError({count: 3})
  }

  return yield* new MyIHateThisError()
}).pipe(Effect.catchTag("MyIHateThisError", () => Effect.log("I hate this error!")))

main.pipe(Effect.runPromise)
