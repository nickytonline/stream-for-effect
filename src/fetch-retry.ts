import { Effect, Data, Schedule } from "effect"

class MyLovelyError extends Data.TaggedError("MyLovelyError")<{
  count: number
}>{
}

class MyIHateThisError extends Data.TaggedError("MyIHateThisError")<{}>{
}

class FetchError extends Data.TaggedError("FetchError")<{
  error: unknown
}>{
}

const performFetch = Effect.tryPromise({
    async try() {
      return fetch("https://jsonplaceholder.typicode.com/todos/1")
    },
    catch(error) {
      return new FetchError({error})
    }
  })

const main = (fetcher: typeof performFetch) => Effect.gen(function* () {
  const result = yield* fetcher
  yield* Effect.log(result.statusText)
}).pipe(Effect.retry({
  schedule: Schedule.exponential("10 millis"),
  times: 5,
  while: (error) => error._tag === "FetchError"
}), Effect.orDie)

main(performFetch).pipe(Effect.runPromise)
