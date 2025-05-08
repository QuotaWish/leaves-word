
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model audio_file
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type audio_file = $Result.DefaultSelection<Prisma.$audio_filePayload>
/**
 * Model category
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type category = $Result.DefaultSelection<Prisma.$categoryPayload>
/**
 * Model dictionary_category
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type dictionary_category = $Result.DefaultSelection<Prisma.$dictionary_categoryPayload>
/**
 * Model dictionary_word
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type dictionary_word = $Result.DefaultSelection<Prisma.$dictionary_wordPayload>
/**
 * Model english_dictionary
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type english_dictionary = $Result.DefaultSelection<Prisma.$english_dictionaryPayload>
/**
 * Model english_word
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type english_word = $Result.DefaultSelection<Prisma.$english_wordPayload>
/**
 * Model english_word_change_log
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type english_word_change_log = $Result.DefaultSelection<Prisma.$english_word_change_logPayload>
/**
 * Model media_creator
 * 
 */
export type media_creator = $Result.DefaultSelection<Prisma.$media_creatorPayload>
/**
 * Model post
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type post = $Result.DefaultSelection<Prisma.$postPayload>
/**
 * Model post_favour
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type post_favour = $Result.DefaultSelection<Prisma.$post_favourPayload>
/**
 * Model post_thumb
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type post_thumb = $Result.DefaultSelection<Prisma.$post_thumbPayload>
/**
 * Model user
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type user = $Result.DefaultSelection<Prisma.$userPayload>
/**
 * Model user_config
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type user_config = $Result.DefaultSelection<Prisma.$user_configPayload>
/**
 * Model word_status_change
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type word_status_change = $Result.DefaultSelection<Prisma.$word_status_changePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Audio_files
 * const audio_files = await prisma.audio_file.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Audio_files
   * const audio_files = await prisma.audio_file.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.audio_file`: Exposes CRUD operations for the **audio_file** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Audio_files
    * const audio_files = await prisma.audio_file.findMany()
    * ```
    */
  get audio_file(): Prisma.audio_fileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.category`: Exposes CRUD operations for the **category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): Prisma.categoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dictionary_category`: Exposes CRUD operations for the **dictionary_category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Dictionary_categories
    * const dictionary_categories = await prisma.dictionary_category.findMany()
    * ```
    */
  get dictionary_category(): Prisma.dictionary_categoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dictionary_word`: Exposes CRUD operations for the **dictionary_word** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Dictionary_words
    * const dictionary_words = await prisma.dictionary_word.findMany()
    * ```
    */
  get dictionary_word(): Prisma.dictionary_wordDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.english_dictionary`: Exposes CRUD operations for the **english_dictionary** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more English_dictionaries
    * const english_dictionaries = await prisma.english_dictionary.findMany()
    * ```
    */
  get english_dictionary(): Prisma.english_dictionaryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.english_word`: Exposes CRUD operations for the **english_word** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more English_words
    * const english_words = await prisma.english_word.findMany()
    * ```
    */
  get english_word(): Prisma.english_wordDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.english_word_change_log`: Exposes CRUD operations for the **english_word_change_log** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more English_word_change_logs
    * const english_word_change_logs = await prisma.english_word_change_log.findMany()
    * ```
    */
  get english_word_change_log(): Prisma.english_word_change_logDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.media_creator`: Exposes CRUD operations for the **media_creator** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Media_creators
    * const media_creators = await prisma.media_creator.findMany()
    * ```
    */
  get media_creator(): Prisma.media_creatorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.post`: Exposes CRUD operations for the **post** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Posts
    * const posts = await prisma.post.findMany()
    * ```
    */
  get post(): Prisma.postDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.post_favour`: Exposes CRUD operations for the **post_favour** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Post_favours
    * const post_favours = await prisma.post_favour.findMany()
    * ```
    */
  get post_favour(): Prisma.post_favourDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.post_thumb`: Exposes CRUD operations for the **post_thumb** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Post_thumbs
    * const post_thumbs = await prisma.post_thumb.findMany()
    * ```
    */
  get post_thumb(): Prisma.post_thumbDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **user** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.userDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user_config`: Exposes CRUD operations for the **user_config** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more User_configs
    * const user_configs = await prisma.user_config.findMany()
    * ```
    */
  get user_config(): Prisma.user_configDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.word_status_change`: Exposes CRUD operations for the **word_status_change** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Word_status_changes
    * const word_status_changes = await prisma.word_status_change.findMany()
    * ```
    */
  get word_status_change(): Prisma.word_status_changeDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    audio_file: 'audio_file',
    category: 'category',
    dictionary_category: 'dictionary_category',
    dictionary_word: 'dictionary_word',
    english_dictionary: 'english_dictionary',
    english_word: 'english_word',
    english_word_change_log: 'english_word_change_log',
    media_creator: 'media_creator',
    post: 'post',
    post_favour: 'post_favour',
    post_thumb: 'post_thumb',
    user: 'user',
    user_config: 'user_config',
    word_status_change: 'word_status_change'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "audio_file" | "category" | "dictionary_category" | "dictionary_word" | "english_dictionary" | "english_word" | "english_word_change_log" | "media_creator" | "post" | "post_favour" | "post_thumb" | "user" | "user_config" | "word_status_change"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      audio_file: {
        payload: Prisma.$audio_filePayload<ExtArgs>
        fields: Prisma.audio_fileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.audio_fileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audio_filePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.audio_fileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audio_filePayload>
          }
          findFirst: {
            args: Prisma.audio_fileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audio_filePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.audio_fileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audio_filePayload>
          }
          findMany: {
            args: Prisma.audio_fileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audio_filePayload>[]
          }
          create: {
            args: Prisma.audio_fileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audio_filePayload>
          }
          createMany: {
            args: Prisma.audio_fileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.audio_fileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audio_filePayload>
          }
          update: {
            args: Prisma.audio_fileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audio_filePayload>
          }
          deleteMany: {
            args: Prisma.audio_fileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.audio_fileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.audio_fileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audio_filePayload>
          }
          aggregate: {
            args: Prisma.Audio_fileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAudio_file>
          }
          groupBy: {
            args: Prisma.audio_fileGroupByArgs<ExtArgs>
            result: $Utils.Optional<Audio_fileGroupByOutputType>[]
          }
          count: {
            args: Prisma.audio_fileCountArgs<ExtArgs>
            result: $Utils.Optional<Audio_fileCountAggregateOutputType> | number
          }
        }
      }
      category: {
        payload: Prisma.$categoryPayload<ExtArgs>
        fields: Prisma.categoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.categoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.categoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoryPayload>
          }
          findFirst: {
            args: Prisma.categoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.categoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoryPayload>
          }
          findMany: {
            args: Prisma.categoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoryPayload>[]
          }
          create: {
            args: Prisma.categoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoryPayload>
          }
          createMany: {
            args: Prisma.categoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.categoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoryPayload>
          }
          update: {
            args: Prisma.categoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoryPayload>
          }
          deleteMany: {
            args: Prisma.categoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.categoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.categoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoryPayload>
          }
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategory>
          }
          groupBy: {
            args: Prisma.categoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.categoryCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number
          }
        }
      }
      dictionary_category: {
        payload: Prisma.$dictionary_categoryPayload<ExtArgs>
        fields: Prisma.dictionary_categoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.dictionary_categoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dictionary_categoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.dictionary_categoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dictionary_categoryPayload>
          }
          findFirst: {
            args: Prisma.dictionary_categoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dictionary_categoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.dictionary_categoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dictionary_categoryPayload>
          }
          findMany: {
            args: Prisma.dictionary_categoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dictionary_categoryPayload>[]
          }
          create: {
            args: Prisma.dictionary_categoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dictionary_categoryPayload>
          }
          createMany: {
            args: Prisma.dictionary_categoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.dictionary_categoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dictionary_categoryPayload>
          }
          update: {
            args: Prisma.dictionary_categoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dictionary_categoryPayload>
          }
          deleteMany: {
            args: Prisma.dictionary_categoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.dictionary_categoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.dictionary_categoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dictionary_categoryPayload>
          }
          aggregate: {
            args: Prisma.Dictionary_categoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDictionary_category>
          }
          groupBy: {
            args: Prisma.dictionary_categoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<Dictionary_categoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.dictionary_categoryCountArgs<ExtArgs>
            result: $Utils.Optional<Dictionary_categoryCountAggregateOutputType> | number
          }
        }
      }
      dictionary_word: {
        payload: Prisma.$dictionary_wordPayload<ExtArgs>
        fields: Prisma.dictionary_wordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.dictionary_wordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dictionary_wordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.dictionary_wordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dictionary_wordPayload>
          }
          findFirst: {
            args: Prisma.dictionary_wordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dictionary_wordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.dictionary_wordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dictionary_wordPayload>
          }
          findMany: {
            args: Prisma.dictionary_wordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dictionary_wordPayload>[]
          }
          create: {
            args: Prisma.dictionary_wordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dictionary_wordPayload>
          }
          createMany: {
            args: Prisma.dictionary_wordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.dictionary_wordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dictionary_wordPayload>
          }
          update: {
            args: Prisma.dictionary_wordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dictionary_wordPayload>
          }
          deleteMany: {
            args: Prisma.dictionary_wordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.dictionary_wordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.dictionary_wordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dictionary_wordPayload>
          }
          aggregate: {
            args: Prisma.Dictionary_wordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDictionary_word>
          }
          groupBy: {
            args: Prisma.dictionary_wordGroupByArgs<ExtArgs>
            result: $Utils.Optional<Dictionary_wordGroupByOutputType>[]
          }
          count: {
            args: Prisma.dictionary_wordCountArgs<ExtArgs>
            result: $Utils.Optional<Dictionary_wordCountAggregateOutputType> | number
          }
        }
      }
      english_dictionary: {
        payload: Prisma.$english_dictionaryPayload<ExtArgs>
        fields: Prisma.english_dictionaryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.english_dictionaryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_dictionaryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.english_dictionaryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_dictionaryPayload>
          }
          findFirst: {
            args: Prisma.english_dictionaryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_dictionaryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.english_dictionaryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_dictionaryPayload>
          }
          findMany: {
            args: Prisma.english_dictionaryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_dictionaryPayload>[]
          }
          create: {
            args: Prisma.english_dictionaryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_dictionaryPayload>
          }
          createMany: {
            args: Prisma.english_dictionaryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.english_dictionaryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_dictionaryPayload>
          }
          update: {
            args: Prisma.english_dictionaryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_dictionaryPayload>
          }
          deleteMany: {
            args: Prisma.english_dictionaryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.english_dictionaryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.english_dictionaryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_dictionaryPayload>
          }
          aggregate: {
            args: Prisma.English_dictionaryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEnglish_dictionary>
          }
          groupBy: {
            args: Prisma.english_dictionaryGroupByArgs<ExtArgs>
            result: $Utils.Optional<English_dictionaryGroupByOutputType>[]
          }
          count: {
            args: Prisma.english_dictionaryCountArgs<ExtArgs>
            result: $Utils.Optional<English_dictionaryCountAggregateOutputType> | number
          }
        }
      }
      english_word: {
        payload: Prisma.$english_wordPayload<ExtArgs>
        fields: Prisma.english_wordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.english_wordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_wordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.english_wordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_wordPayload>
          }
          findFirst: {
            args: Prisma.english_wordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_wordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.english_wordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_wordPayload>
          }
          findMany: {
            args: Prisma.english_wordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_wordPayload>[]
          }
          create: {
            args: Prisma.english_wordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_wordPayload>
          }
          createMany: {
            args: Prisma.english_wordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.english_wordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_wordPayload>
          }
          update: {
            args: Prisma.english_wordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_wordPayload>
          }
          deleteMany: {
            args: Prisma.english_wordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.english_wordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.english_wordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_wordPayload>
          }
          aggregate: {
            args: Prisma.English_wordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEnglish_word>
          }
          groupBy: {
            args: Prisma.english_wordGroupByArgs<ExtArgs>
            result: $Utils.Optional<English_wordGroupByOutputType>[]
          }
          count: {
            args: Prisma.english_wordCountArgs<ExtArgs>
            result: $Utils.Optional<English_wordCountAggregateOutputType> | number
          }
        }
      }
      english_word_change_log: {
        payload: Prisma.$english_word_change_logPayload<ExtArgs>
        fields: Prisma.english_word_change_logFieldRefs
        operations: {
          findUnique: {
            args: Prisma.english_word_change_logFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_word_change_logPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.english_word_change_logFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_word_change_logPayload>
          }
          findFirst: {
            args: Prisma.english_word_change_logFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_word_change_logPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.english_word_change_logFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_word_change_logPayload>
          }
          findMany: {
            args: Prisma.english_word_change_logFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_word_change_logPayload>[]
          }
          create: {
            args: Prisma.english_word_change_logCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_word_change_logPayload>
          }
          createMany: {
            args: Prisma.english_word_change_logCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.english_word_change_logDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_word_change_logPayload>
          }
          update: {
            args: Prisma.english_word_change_logUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_word_change_logPayload>
          }
          deleteMany: {
            args: Prisma.english_word_change_logDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.english_word_change_logUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.english_word_change_logUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$english_word_change_logPayload>
          }
          aggregate: {
            args: Prisma.English_word_change_logAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEnglish_word_change_log>
          }
          groupBy: {
            args: Prisma.english_word_change_logGroupByArgs<ExtArgs>
            result: $Utils.Optional<English_word_change_logGroupByOutputType>[]
          }
          count: {
            args: Prisma.english_word_change_logCountArgs<ExtArgs>
            result: $Utils.Optional<English_word_change_logCountAggregateOutputType> | number
          }
        }
      }
      media_creator: {
        payload: Prisma.$media_creatorPayload<ExtArgs>
        fields: Prisma.media_creatorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.media_creatorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$media_creatorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.media_creatorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$media_creatorPayload>
          }
          findFirst: {
            args: Prisma.media_creatorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$media_creatorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.media_creatorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$media_creatorPayload>
          }
          findMany: {
            args: Prisma.media_creatorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$media_creatorPayload>[]
          }
          create: {
            args: Prisma.media_creatorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$media_creatorPayload>
          }
          createMany: {
            args: Prisma.media_creatorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.media_creatorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$media_creatorPayload>
          }
          update: {
            args: Prisma.media_creatorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$media_creatorPayload>
          }
          deleteMany: {
            args: Prisma.media_creatorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.media_creatorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.media_creatorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$media_creatorPayload>
          }
          aggregate: {
            args: Prisma.Media_creatorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMedia_creator>
          }
          groupBy: {
            args: Prisma.media_creatorGroupByArgs<ExtArgs>
            result: $Utils.Optional<Media_creatorGroupByOutputType>[]
          }
          count: {
            args: Prisma.media_creatorCountArgs<ExtArgs>
            result: $Utils.Optional<Media_creatorCountAggregateOutputType> | number
          }
        }
      }
      post: {
        payload: Prisma.$postPayload<ExtArgs>
        fields: Prisma.postFieldRefs
        operations: {
          findUnique: {
            args: Prisma.postFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$postPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.postFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$postPayload>
          }
          findFirst: {
            args: Prisma.postFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$postPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.postFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$postPayload>
          }
          findMany: {
            args: Prisma.postFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$postPayload>[]
          }
          create: {
            args: Prisma.postCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$postPayload>
          }
          createMany: {
            args: Prisma.postCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.postDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$postPayload>
          }
          update: {
            args: Prisma.postUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$postPayload>
          }
          deleteMany: {
            args: Prisma.postDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.postUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.postUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$postPayload>
          }
          aggregate: {
            args: Prisma.PostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePost>
          }
          groupBy: {
            args: Prisma.postGroupByArgs<ExtArgs>
            result: $Utils.Optional<PostGroupByOutputType>[]
          }
          count: {
            args: Prisma.postCountArgs<ExtArgs>
            result: $Utils.Optional<PostCountAggregateOutputType> | number
          }
        }
      }
      post_favour: {
        payload: Prisma.$post_favourPayload<ExtArgs>
        fields: Prisma.post_favourFieldRefs
        operations: {
          findUnique: {
            args: Prisma.post_favourFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$post_favourPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.post_favourFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$post_favourPayload>
          }
          findFirst: {
            args: Prisma.post_favourFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$post_favourPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.post_favourFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$post_favourPayload>
          }
          findMany: {
            args: Prisma.post_favourFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$post_favourPayload>[]
          }
          create: {
            args: Prisma.post_favourCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$post_favourPayload>
          }
          createMany: {
            args: Prisma.post_favourCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.post_favourDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$post_favourPayload>
          }
          update: {
            args: Prisma.post_favourUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$post_favourPayload>
          }
          deleteMany: {
            args: Prisma.post_favourDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.post_favourUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.post_favourUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$post_favourPayload>
          }
          aggregate: {
            args: Prisma.Post_favourAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePost_favour>
          }
          groupBy: {
            args: Prisma.post_favourGroupByArgs<ExtArgs>
            result: $Utils.Optional<Post_favourGroupByOutputType>[]
          }
          count: {
            args: Prisma.post_favourCountArgs<ExtArgs>
            result: $Utils.Optional<Post_favourCountAggregateOutputType> | number
          }
        }
      }
      post_thumb: {
        payload: Prisma.$post_thumbPayload<ExtArgs>
        fields: Prisma.post_thumbFieldRefs
        operations: {
          findUnique: {
            args: Prisma.post_thumbFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$post_thumbPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.post_thumbFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$post_thumbPayload>
          }
          findFirst: {
            args: Prisma.post_thumbFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$post_thumbPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.post_thumbFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$post_thumbPayload>
          }
          findMany: {
            args: Prisma.post_thumbFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$post_thumbPayload>[]
          }
          create: {
            args: Prisma.post_thumbCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$post_thumbPayload>
          }
          createMany: {
            args: Prisma.post_thumbCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.post_thumbDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$post_thumbPayload>
          }
          update: {
            args: Prisma.post_thumbUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$post_thumbPayload>
          }
          deleteMany: {
            args: Prisma.post_thumbDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.post_thumbUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.post_thumbUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$post_thumbPayload>
          }
          aggregate: {
            args: Prisma.Post_thumbAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePost_thumb>
          }
          groupBy: {
            args: Prisma.post_thumbGroupByArgs<ExtArgs>
            result: $Utils.Optional<Post_thumbGroupByOutputType>[]
          }
          count: {
            args: Prisma.post_thumbCountArgs<ExtArgs>
            result: $Utils.Optional<Post_thumbCountAggregateOutputType> | number
          }
        }
      }
      user: {
        payload: Prisma.$userPayload<ExtArgs>
        fields: Prisma.userFieldRefs
        operations: {
          findUnique: {
            args: Prisma.userFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.userFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          findFirst: {
            args: Prisma.userFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.userFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          findMany: {
            args: Prisma.userFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>[]
          }
          create: {
            args: Prisma.userCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          createMany: {
            args: Prisma.userCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.userDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          update: {
            args: Prisma.userUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          deleteMany: {
            args: Prisma.userDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.userUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.userUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.userGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.userCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      user_config: {
        payload: Prisma.$user_configPayload<ExtArgs>
        fields: Prisma.user_configFieldRefs
        operations: {
          findUnique: {
            args: Prisma.user_configFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_configPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.user_configFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_configPayload>
          }
          findFirst: {
            args: Prisma.user_configFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_configPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.user_configFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_configPayload>
          }
          findMany: {
            args: Prisma.user_configFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_configPayload>[]
          }
          create: {
            args: Prisma.user_configCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_configPayload>
          }
          createMany: {
            args: Prisma.user_configCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.user_configDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_configPayload>
          }
          update: {
            args: Prisma.user_configUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_configPayload>
          }
          deleteMany: {
            args: Prisma.user_configDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.user_configUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.user_configUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_configPayload>
          }
          aggregate: {
            args: Prisma.User_configAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser_config>
          }
          groupBy: {
            args: Prisma.user_configGroupByArgs<ExtArgs>
            result: $Utils.Optional<User_configGroupByOutputType>[]
          }
          count: {
            args: Prisma.user_configCountArgs<ExtArgs>
            result: $Utils.Optional<User_configCountAggregateOutputType> | number
          }
        }
      }
      word_status_change: {
        payload: Prisma.$word_status_changePayload<ExtArgs>
        fields: Prisma.word_status_changeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.word_status_changeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$word_status_changePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.word_status_changeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$word_status_changePayload>
          }
          findFirst: {
            args: Prisma.word_status_changeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$word_status_changePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.word_status_changeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$word_status_changePayload>
          }
          findMany: {
            args: Prisma.word_status_changeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$word_status_changePayload>[]
          }
          create: {
            args: Prisma.word_status_changeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$word_status_changePayload>
          }
          createMany: {
            args: Prisma.word_status_changeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.word_status_changeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$word_status_changePayload>
          }
          update: {
            args: Prisma.word_status_changeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$word_status_changePayload>
          }
          deleteMany: {
            args: Prisma.word_status_changeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.word_status_changeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.word_status_changeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$word_status_changePayload>
          }
          aggregate: {
            args: Prisma.Word_status_changeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWord_status_change>
          }
          groupBy: {
            args: Prisma.word_status_changeGroupByArgs<ExtArgs>
            result: $Utils.Optional<Word_status_changeGroupByOutputType>[]
          }
          count: {
            args: Prisma.word_status_changeCountArgs<ExtArgs>
            result: $Utils.Optional<Word_status_changeCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    audio_file?: audio_fileOmit
    category?: categoryOmit
    dictionary_category?: dictionary_categoryOmit
    dictionary_word?: dictionary_wordOmit
    english_dictionary?: english_dictionaryOmit
    english_word?: english_wordOmit
    english_word_change_log?: english_word_change_logOmit
    media_creator?: media_creatorOmit
    post?: postOmit
    post_favour?: post_favourOmit
    post_thumb?: post_thumbOmit
    user?: userOmit
    user_config?: user_configOmit
    word_status_change?: word_status_changeOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type English_dictionaryCountOutputType
   */

  export type English_dictionaryCountOutputType = {
    dictionary_word: number
  }

  export type English_dictionaryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dictionary_word?: boolean | English_dictionaryCountOutputTypeCountDictionary_wordArgs
  }

  // Custom InputTypes
  /**
   * English_dictionaryCountOutputType without action
   */
  export type English_dictionaryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the English_dictionaryCountOutputType
     */
    select?: English_dictionaryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * English_dictionaryCountOutputType without action
   */
  export type English_dictionaryCountOutputTypeCountDictionary_wordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: dictionary_wordWhereInput
  }


  /**
   * Count Type English_wordCountOutputType
   */

  export type English_wordCountOutputType = {
    dictionary_word: number
    english_word_change_log: number
    media_creator: number
  }

  export type English_wordCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dictionary_word?: boolean | English_wordCountOutputTypeCountDictionary_wordArgs
    english_word_change_log?: boolean | English_wordCountOutputTypeCountEnglish_word_change_logArgs
    media_creator?: boolean | English_wordCountOutputTypeCountMedia_creatorArgs
  }

  // Custom InputTypes
  /**
   * English_wordCountOutputType without action
   */
  export type English_wordCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the English_wordCountOutputType
     */
    select?: English_wordCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * English_wordCountOutputType without action
   */
  export type English_wordCountOutputTypeCountDictionary_wordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: dictionary_wordWhereInput
  }

  /**
   * English_wordCountOutputType without action
   */
  export type English_wordCountOutputTypeCountEnglish_word_change_logArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: english_word_change_logWhereInput
  }

  /**
   * English_wordCountOutputType without action
   */
  export type English_wordCountOutputTypeCountMedia_creatorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: media_creatorWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    audio_file: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    audio_file?: boolean | UserCountOutputTypeCountAudio_fileArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAudio_fileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: audio_fileWhereInput
  }


  /**
   * Models
   */

  /**
   * Model audio_file
   */

  export type AggregateAudio_file = {
    _count: Audio_fileCountAggregateOutputType | null
    _avg: Audio_fileAvgAggregateOutputType | null
    _sum: Audio_fileSumAggregateOutputType | null
    _min: Audio_fileMinAggregateOutputType | null
    _max: Audio_fileMaxAggregateOutputType | null
  }

  export type Audio_fileAvgAggregateOutputType = {
    id: number | null
    creator_id: number | null
    is_delete: number | null
  }

  export type Audio_fileSumAggregateOutputType = {
    id: bigint | null
    creator_id: bigint | null
    is_delete: number | null
  }

  export type Audio_fileMinAggregateOutputType = {
    id: bigint | null
    path: string | null
    content: string | null
    creator_id: bigint | null
    create_time: Date | null
    update_time: Date | null
    is_delete: number | null
    status: string | null
    name: string | null
  }

  export type Audio_fileMaxAggregateOutputType = {
    id: bigint | null
    path: string | null
    content: string | null
    creator_id: bigint | null
    create_time: Date | null
    update_time: Date | null
    is_delete: number | null
    status: string | null
    name: string | null
  }

  export type Audio_fileCountAggregateOutputType = {
    id: number
    path: number
    content: number
    creator_id: number
    create_time: number
    update_time: number
    is_delete: number
    status: number
    name: number
    _all: number
  }


  export type Audio_fileAvgAggregateInputType = {
    id?: true
    creator_id?: true
    is_delete?: true
  }

  export type Audio_fileSumAggregateInputType = {
    id?: true
    creator_id?: true
    is_delete?: true
  }

  export type Audio_fileMinAggregateInputType = {
    id?: true
    path?: true
    content?: true
    creator_id?: true
    create_time?: true
    update_time?: true
    is_delete?: true
    status?: true
    name?: true
  }

  export type Audio_fileMaxAggregateInputType = {
    id?: true
    path?: true
    content?: true
    creator_id?: true
    create_time?: true
    update_time?: true
    is_delete?: true
    status?: true
    name?: true
  }

  export type Audio_fileCountAggregateInputType = {
    id?: true
    path?: true
    content?: true
    creator_id?: true
    create_time?: true
    update_time?: true
    is_delete?: true
    status?: true
    name?: true
    _all?: true
  }

  export type Audio_fileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which audio_file to aggregate.
     */
    where?: audio_fileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of audio_files to fetch.
     */
    orderBy?: audio_fileOrderByWithRelationInput | audio_fileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: audio_fileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` audio_files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` audio_files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned audio_files
    **/
    _count?: true | Audio_fileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Audio_fileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Audio_fileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Audio_fileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Audio_fileMaxAggregateInputType
  }

  export type GetAudio_fileAggregateType<T extends Audio_fileAggregateArgs> = {
        [P in keyof T & keyof AggregateAudio_file]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAudio_file[P]>
      : GetScalarType<T[P], AggregateAudio_file[P]>
  }




  export type audio_fileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: audio_fileWhereInput
    orderBy?: audio_fileOrderByWithAggregationInput | audio_fileOrderByWithAggregationInput[]
    by: Audio_fileScalarFieldEnum[] | Audio_fileScalarFieldEnum
    having?: audio_fileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Audio_fileCountAggregateInputType | true
    _avg?: Audio_fileAvgAggregateInputType
    _sum?: Audio_fileSumAggregateInputType
    _min?: Audio_fileMinAggregateInputType
    _max?: Audio_fileMaxAggregateInputType
  }

  export type Audio_fileGroupByOutputType = {
    id: bigint
    path: string | null
    content: string | null
    creator_id: bigint | null
    create_time: Date | null
    update_time: Date | null
    is_delete: number | null
    status: string
    name: string
    _count: Audio_fileCountAggregateOutputType | null
    _avg: Audio_fileAvgAggregateOutputType | null
    _sum: Audio_fileSumAggregateOutputType | null
    _min: Audio_fileMinAggregateOutputType | null
    _max: Audio_fileMaxAggregateOutputType | null
  }

  type GetAudio_fileGroupByPayload<T extends audio_fileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Audio_fileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Audio_fileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Audio_fileGroupByOutputType[P]>
            : GetScalarType<T[P], Audio_fileGroupByOutputType[P]>
        }
      >
    >


  export type audio_fileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    path?: boolean
    content?: boolean
    creator_id?: boolean
    create_time?: boolean
    update_time?: boolean
    is_delete?: boolean
    status?: boolean
    name?: boolean
    user?: boolean | audio_file$userArgs<ExtArgs>
  }, ExtArgs["result"]["audio_file"]>



  export type audio_fileSelectScalar = {
    id?: boolean
    path?: boolean
    content?: boolean
    creator_id?: boolean
    create_time?: boolean
    update_time?: boolean
    is_delete?: boolean
    status?: boolean
    name?: boolean
  }

  export type audio_fileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "path" | "content" | "creator_id" | "create_time" | "update_time" | "is_delete" | "status" | "name", ExtArgs["result"]["audio_file"]>
  export type audio_fileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | audio_file$userArgs<ExtArgs>
  }

  export type $audio_filePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "audio_file"
    objects: {
      user: Prisma.$userPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      path: string | null
      content: string | null
      creator_id: bigint | null
      create_time: Date | null
      update_time: Date | null
      is_delete: number | null
      status: string
      name: string
    }, ExtArgs["result"]["audio_file"]>
    composites: {}
  }

  type audio_fileGetPayload<S extends boolean | null | undefined | audio_fileDefaultArgs> = $Result.GetResult<Prisma.$audio_filePayload, S>

  type audio_fileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<audio_fileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Audio_fileCountAggregateInputType | true
    }

  export interface audio_fileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['audio_file'], meta: { name: 'audio_file' } }
    /**
     * Find zero or one Audio_file that matches the filter.
     * @param {audio_fileFindUniqueArgs} args - Arguments to find a Audio_file
     * @example
     * // Get one Audio_file
     * const audio_file = await prisma.audio_file.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends audio_fileFindUniqueArgs>(args: SelectSubset<T, audio_fileFindUniqueArgs<ExtArgs>>): Prisma__audio_fileClient<$Result.GetResult<Prisma.$audio_filePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Audio_file that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {audio_fileFindUniqueOrThrowArgs} args - Arguments to find a Audio_file
     * @example
     * // Get one Audio_file
     * const audio_file = await prisma.audio_file.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends audio_fileFindUniqueOrThrowArgs>(args: SelectSubset<T, audio_fileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__audio_fileClient<$Result.GetResult<Prisma.$audio_filePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Audio_file that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audio_fileFindFirstArgs} args - Arguments to find a Audio_file
     * @example
     * // Get one Audio_file
     * const audio_file = await prisma.audio_file.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends audio_fileFindFirstArgs>(args?: SelectSubset<T, audio_fileFindFirstArgs<ExtArgs>>): Prisma__audio_fileClient<$Result.GetResult<Prisma.$audio_filePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Audio_file that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audio_fileFindFirstOrThrowArgs} args - Arguments to find a Audio_file
     * @example
     * // Get one Audio_file
     * const audio_file = await prisma.audio_file.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends audio_fileFindFirstOrThrowArgs>(args?: SelectSubset<T, audio_fileFindFirstOrThrowArgs<ExtArgs>>): Prisma__audio_fileClient<$Result.GetResult<Prisma.$audio_filePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Audio_files that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audio_fileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Audio_files
     * const audio_files = await prisma.audio_file.findMany()
     * 
     * // Get first 10 Audio_files
     * const audio_files = await prisma.audio_file.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const audio_fileWithIdOnly = await prisma.audio_file.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends audio_fileFindManyArgs>(args?: SelectSubset<T, audio_fileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$audio_filePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Audio_file.
     * @param {audio_fileCreateArgs} args - Arguments to create a Audio_file.
     * @example
     * // Create one Audio_file
     * const Audio_file = await prisma.audio_file.create({
     *   data: {
     *     // ... data to create a Audio_file
     *   }
     * })
     * 
     */
    create<T extends audio_fileCreateArgs>(args: SelectSubset<T, audio_fileCreateArgs<ExtArgs>>): Prisma__audio_fileClient<$Result.GetResult<Prisma.$audio_filePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Audio_files.
     * @param {audio_fileCreateManyArgs} args - Arguments to create many Audio_files.
     * @example
     * // Create many Audio_files
     * const audio_file = await prisma.audio_file.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends audio_fileCreateManyArgs>(args?: SelectSubset<T, audio_fileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Audio_file.
     * @param {audio_fileDeleteArgs} args - Arguments to delete one Audio_file.
     * @example
     * // Delete one Audio_file
     * const Audio_file = await prisma.audio_file.delete({
     *   where: {
     *     // ... filter to delete one Audio_file
     *   }
     * })
     * 
     */
    delete<T extends audio_fileDeleteArgs>(args: SelectSubset<T, audio_fileDeleteArgs<ExtArgs>>): Prisma__audio_fileClient<$Result.GetResult<Prisma.$audio_filePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Audio_file.
     * @param {audio_fileUpdateArgs} args - Arguments to update one Audio_file.
     * @example
     * // Update one Audio_file
     * const audio_file = await prisma.audio_file.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends audio_fileUpdateArgs>(args: SelectSubset<T, audio_fileUpdateArgs<ExtArgs>>): Prisma__audio_fileClient<$Result.GetResult<Prisma.$audio_filePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Audio_files.
     * @param {audio_fileDeleteManyArgs} args - Arguments to filter Audio_files to delete.
     * @example
     * // Delete a few Audio_files
     * const { count } = await prisma.audio_file.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends audio_fileDeleteManyArgs>(args?: SelectSubset<T, audio_fileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Audio_files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audio_fileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Audio_files
     * const audio_file = await prisma.audio_file.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends audio_fileUpdateManyArgs>(args: SelectSubset<T, audio_fileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Audio_file.
     * @param {audio_fileUpsertArgs} args - Arguments to update or create a Audio_file.
     * @example
     * // Update or create a Audio_file
     * const audio_file = await prisma.audio_file.upsert({
     *   create: {
     *     // ... data to create a Audio_file
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Audio_file we want to update
     *   }
     * })
     */
    upsert<T extends audio_fileUpsertArgs>(args: SelectSubset<T, audio_fileUpsertArgs<ExtArgs>>): Prisma__audio_fileClient<$Result.GetResult<Prisma.$audio_filePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Audio_files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audio_fileCountArgs} args - Arguments to filter Audio_files to count.
     * @example
     * // Count the number of Audio_files
     * const count = await prisma.audio_file.count({
     *   where: {
     *     // ... the filter for the Audio_files we want to count
     *   }
     * })
    **/
    count<T extends audio_fileCountArgs>(
      args?: Subset<T, audio_fileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Audio_fileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Audio_file.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Audio_fileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Audio_fileAggregateArgs>(args: Subset<T, Audio_fileAggregateArgs>): Prisma.PrismaPromise<GetAudio_fileAggregateType<T>>

    /**
     * Group by Audio_file.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audio_fileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends audio_fileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: audio_fileGroupByArgs['orderBy'] }
        : { orderBy?: audio_fileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, audio_fileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAudio_fileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the audio_file model
   */
  readonly fields: audio_fileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for audio_file.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__audio_fileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends audio_file$userArgs<ExtArgs> = {}>(args?: Subset<T, audio_file$userArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the audio_file model
   */
  interface audio_fileFieldRefs {
    readonly id: FieldRef<"audio_file", 'BigInt'>
    readonly path: FieldRef<"audio_file", 'String'>
    readonly content: FieldRef<"audio_file", 'String'>
    readonly creator_id: FieldRef<"audio_file", 'BigInt'>
    readonly create_time: FieldRef<"audio_file", 'DateTime'>
    readonly update_time: FieldRef<"audio_file", 'DateTime'>
    readonly is_delete: FieldRef<"audio_file", 'Int'>
    readonly status: FieldRef<"audio_file", 'String'>
    readonly name: FieldRef<"audio_file", 'String'>
  }
    

  // Custom InputTypes
  /**
   * audio_file findUnique
   */
  export type audio_fileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audio_file
     */
    select?: audio_fileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audio_file
     */
    omit?: audio_fileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: audio_fileInclude<ExtArgs> | null
    /**
     * Filter, which audio_file to fetch.
     */
    where: audio_fileWhereUniqueInput
  }

  /**
   * audio_file findUniqueOrThrow
   */
  export type audio_fileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audio_file
     */
    select?: audio_fileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audio_file
     */
    omit?: audio_fileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: audio_fileInclude<ExtArgs> | null
    /**
     * Filter, which audio_file to fetch.
     */
    where: audio_fileWhereUniqueInput
  }

  /**
   * audio_file findFirst
   */
  export type audio_fileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audio_file
     */
    select?: audio_fileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audio_file
     */
    omit?: audio_fileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: audio_fileInclude<ExtArgs> | null
    /**
     * Filter, which audio_file to fetch.
     */
    where?: audio_fileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of audio_files to fetch.
     */
    orderBy?: audio_fileOrderByWithRelationInput | audio_fileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for audio_files.
     */
    cursor?: audio_fileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` audio_files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` audio_files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of audio_files.
     */
    distinct?: Audio_fileScalarFieldEnum | Audio_fileScalarFieldEnum[]
  }

  /**
   * audio_file findFirstOrThrow
   */
  export type audio_fileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audio_file
     */
    select?: audio_fileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audio_file
     */
    omit?: audio_fileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: audio_fileInclude<ExtArgs> | null
    /**
     * Filter, which audio_file to fetch.
     */
    where?: audio_fileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of audio_files to fetch.
     */
    orderBy?: audio_fileOrderByWithRelationInput | audio_fileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for audio_files.
     */
    cursor?: audio_fileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` audio_files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` audio_files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of audio_files.
     */
    distinct?: Audio_fileScalarFieldEnum | Audio_fileScalarFieldEnum[]
  }

  /**
   * audio_file findMany
   */
  export type audio_fileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audio_file
     */
    select?: audio_fileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audio_file
     */
    omit?: audio_fileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: audio_fileInclude<ExtArgs> | null
    /**
     * Filter, which audio_files to fetch.
     */
    where?: audio_fileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of audio_files to fetch.
     */
    orderBy?: audio_fileOrderByWithRelationInput | audio_fileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing audio_files.
     */
    cursor?: audio_fileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` audio_files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` audio_files.
     */
    skip?: number
    distinct?: Audio_fileScalarFieldEnum | Audio_fileScalarFieldEnum[]
  }

  /**
   * audio_file create
   */
  export type audio_fileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audio_file
     */
    select?: audio_fileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audio_file
     */
    omit?: audio_fileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: audio_fileInclude<ExtArgs> | null
    /**
     * The data needed to create a audio_file.
     */
    data?: XOR<audio_fileCreateInput, audio_fileUncheckedCreateInput>
  }

  /**
   * audio_file createMany
   */
  export type audio_fileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many audio_files.
     */
    data: audio_fileCreateManyInput | audio_fileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * audio_file update
   */
  export type audio_fileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audio_file
     */
    select?: audio_fileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audio_file
     */
    omit?: audio_fileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: audio_fileInclude<ExtArgs> | null
    /**
     * The data needed to update a audio_file.
     */
    data: XOR<audio_fileUpdateInput, audio_fileUncheckedUpdateInput>
    /**
     * Choose, which audio_file to update.
     */
    where: audio_fileWhereUniqueInput
  }

  /**
   * audio_file updateMany
   */
  export type audio_fileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update audio_files.
     */
    data: XOR<audio_fileUpdateManyMutationInput, audio_fileUncheckedUpdateManyInput>
    /**
     * Filter which audio_files to update
     */
    where?: audio_fileWhereInput
    /**
     * Limit how many audio_files to update.
     */
    limit?: number
  }

  /**
   * audio_file upsert
   */
  export type audio_fileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audio_file
     */
    select?: audio_fileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audio_file
     */
    omit?: audio_fileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: audio_fileInclude<ExtArgs> | null
    /**
     * The filter to search for the audio_file to update in case it exists.
     */
    where: audio_fileWhereUniqueInput
    /**
     * In case the audio_file found by the `where` argument doesn't exist, create a new audio_file with this data.
     */
    create: XOR<audio_fileCreateInput, audio_fileUncheckedCreateInput>
    /**
     * In case the audio_file was found with the provided `where` argument, update it with this data.
     */
    update: XOR<audio_fileUpdateInput, audio_fileUncheckedUpdateInput>
  }

  /**
   * audio_file delete
   */
  export type audio_fileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audio_file
     */
    select?: audio_fileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audio_file
     */
    omit?: audio_fileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: audio_fileInclude<ExtArgs> | null
    /**
     * Filter which audio_file to delete.
     */
    where: audio_fileWhereUniqueInput
  }

  /**
   * audio_file deleteMany
   */
  export type audio_fileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which audio_files to delete
     */
    where?: audio_fileWhereInput
    /**
     * Limit how many audio_files to delete.
     */
    limit?: number
  }

  /**
   * audio_file.user
   */
  export type audio_file$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    where?: userWhereInput
  }

  /**
   * audio_file without action
   */
  export type audio_fileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audio_file
     */
    select?: audio_fileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audio_file
     */
    omit?: audio_fileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: audio_fileInclude<ExtArgs> | null
  }


  /**
   * Model category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  export type CategoryAvgAggregateOutputType = {
    id: number | null
    parent_id: number | null
    sort_order: number | null
  }

  export type CategorySumAggregateOutputType = {
    id: number | null
    parent_id: number | null
    sort_order: number | null
  }

  export type CategoryMinAggregateOutputType = {
    id: number | null
    parent_id: number | null
    name: string | null
    sort_order: number | null
    description: string | null
    is_root: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type CategoryMaxAggregateOutputType = {
    id: number | null
    parent_id: number | null
    name: string | null
    sort_order: number | null
    description: string | null
    is_root: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type CategoryCountAggregateOutputType = {
    id: number
    parent_id: number
    name: number
    sort_order: number
    description: number
    is_root: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type CategoryAvgAggregateInputType = {
    id?: true
    parent_id?: true
    sort_order?: true
  }

  export type CategorySumAggregateInputType = {
    id?: true
    parent_id?: true
    sort_order?: true
  }

  export type CategoryMinAggregateInputType = {
    id?: true
    parent_id?: true
    name?: true
    sort_order?: true
    description?: true
    is_root?: true
    created_at?: true
    updated_at?: true
  }

  export type CategoryMaxAggregateInputType = {
    id?: true
    parent_id?: true
    name?: true
    sort_order?: true
    description?: true
    is_root?: true
    created_at?: true
    updated_at?: true
  }

  export type CategoryCountAggregateInputType = {
    id?: true
    parent_id?: true
    name?: true
    sort_order?: true
    description?: true
    is_root?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type CategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which category to aggregate.
     */
    where?: categoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of categories to fetch.
     */
    orderBy?: categoryOrderByWithRelationInput | categoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: categoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned categories
    **/
    _count?: true | CategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryMaxAggregateInputType
  }

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>
  }




  export type categoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: categoryWhereInput
    orderBy?: categoryOrderByWithAggregationInput | categoryOrderByWithAggregationInput[]
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum
    having?: categoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryCountAggregateInputType | true
    _avg?: CategoryAvgAggregateInputType
    _sum?: CategorySumAggregateInputType
    _min?: CategoryMinAggregateInputType
    _max?: CategoryMaxAggregateInputType
  }

  export type CategoryGroupByOutputType = {
    id: number
    parent_id: number | null
    name: string
    sort_order: number | null
    description: string | null
    is_root: boolean | null
    created_at: Date | null
    updated_at: Date | null
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  type GetCategoryGroupByPayload<T extends categoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
        }
      >
    >


  export type categorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    parent_id?: boolean
    name?: boolean
    sort_order?: boolean
    description?: boolean
    is_root?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["category"]>



  export type categorySelectScalar = {
    id?: boolean
    parent_id?: boolean
    name?: boolean
    sort_order?: boolean
    description?: boolean
    is_root?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type categoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "parent_id" | "name" | "sort_order" | "description" | "is_root" | "created_at" | "updated_at", ExtArgs["result"]["category"]>

  export type $categoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "category"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      parent_id: number | null
      name: string
      sort_order: number | null
      description: string | null
      is_root: boolean | null
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["category"]>
    composites: {}
  }

  type categoryGetPayload<S extends boolean | null | undefined | categoryDefaultArgs> = $Result.GetResult<Prisma.$categoryPayload, S>

  type categoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<categoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoryCountAggregateInputType | true
    }

  export interface categoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['category'], meta: { name: 'category' } }
    /**
     * Find zero or one Category that matches the filter.
     * @param {categoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends categoryFindUniqueArgs>(args: SelectSubset<T, categoryFindUniqueArgs<ExtArgs>>): Prisma__categoryClient<$Result.GetResult<Prisma.$categoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {categoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends categoryFindUniqueOrThrowArgs>(args: SelectSubset<T, categoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__categoryClient<$Result.GetResult<Prisma.$categoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends categoryFindFirstArgs>(args?: SelectSubset<T, categoryFindFirstArgs<ExtArgs>>): Prisma__categoryClient<$Result.GetResult<Prisma.$categoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends categoryFindFirstOrThrowArgs>(args?: SelectSubset<T, categoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__categoryClient<$Result.GetResult<Prisma.$categoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends categoryFindManyArgs>(args?: SelectSubset<T, categoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$categoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Category.
     * @param {categoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     * 
     */
    create<T extends categoryCreateArgs>(args: SelectSubset<T, categoryCreateArgs<ExtArgs>>): Prisma__categoryClient<$Result.GetResult<Prisma.$categoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Categories.
     * @param {categoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends categoryCreateManyArgs>(args?: SelectSubset<T, categoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Category.
     * @param {categoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     * 
     */
    delete<T extends categoryDeleteArgs>(args: SelectSubset<T, categoryDeleteArgs<ExtArgs>>): Prisma__categoryClient<$Result.GetResult<Prisma.$categoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Category.
     * @param {categoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends categoryUpdateArgs>(args: SelectSubset<T, categoryUpdateArgs<ExtArgs>>): Prisma__categoryClient<$Result.GetResult<Prisma.$categoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Categories.
     * @param {categoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends categoryDeleteManyArgs>(args?: SelectSubset<T, categoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends categoryUpdateManyArgs>(args: SelectSubset<T, categoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Category.
     * @param {categoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends categoryUpsertArgs>(args: SelectSubset<T, categoryUpsertArgs<ExtArgs>>): Prisma__categoryClient<$Result.GetResult<Prisma.$categoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends categoryCountArgs>(
      args?: Subset<T, categoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoryAggregateArgs>(args: Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends categoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: categoryGroupByArgs['orderBy'] }
        : { orderBy?: categoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, categoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the category model
   */
  readonly fields: categoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__categoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the category model
   */
  interface categoryFieldRefs {
    readonly id: FieldRef<"category", 'Int'>
    readonly parent_id: FieldRef<"category", 'Int'>
    readonly name: FieldRef<"category", 'String'>
    readonly sort_order: FieldRef<"category", 'Int'>
    readonly description: FieldRef<"category", 'String'>
    readonly is_root: FieldRef<"category", 'Boolean'>
    readonly created_at: FieldRef<"category", 'DateTime'>
    readonly updated_at: FieldRef<"category", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * category findUnique
   */
  export type categoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the category
     */
    select?: categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the category
     */
    omit?: categoryOmit<ExtArgs> | null
    /**
     * Filter, which category to fetch.
     */
    where: categoryWhereUniqueInput
  }

  /**
   * category findUniqueOrThrow
   */
  export type categoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the category
     */
    select?: categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the category
     */
    omit?: categoryOmit<ExtArgs> | null
    /**
     * Filter, which category to fetch.
     */
    where: categoryWhereUniqueInput
  }

  /**
   * category findFirst
   */
  export type categoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the category
     */
    select?: categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the category
     */
    omit?: categoryOmit<ExtArgs> | null
    /**
     * Filter, which category to fetch.
     */
    where?: categoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of categories to fetch.
     */
    orderBy?: categoryOrderByWithRelationInput | categoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for categories.
     */
    cursor?: categoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * category findFirstOrThrow
   */
  export type categoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the category
     */
    select?: categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the category
     */
    omit?: categoryOmit<ExtArgs> | null
    /**
     * Filter, which category to fetch.
     */
    where?: categoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of categories to fetch.
     */
    orderBy?: categoryOrderByWithRelationInput | categoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for categories.
     */
    cursor?: categoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * category findMany
   */
  export type categoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the category
     */
    select?: categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the category
     */
    omit?: categoryOmit<ExtArgs> | null
    /**
     * Filter, which categories to fetch.
     */
    where?: categoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of categories to fetch.
     */
    orderBy?: categoryOrderByWithRelationInput | categoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing categories.
     */
    cursor?: categoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` categories.
     */
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * category create
   */
  export type categoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the category
     */
    select?: categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the category
     */
    omit?: categoryOmit<ExtArgs> | null
    /**
     * The data needed to create a category.
     */
    data: XOR<categoryCreateInput, categoryUncheckedCreateInput>
  }

  /**
   * category createMany
   */
  export type categoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many categories.
     */
    data: categoryCreateManyInput | categoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * category update
   */
  export type categoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the category
     */
    select?: categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the category
     */
    omit?: categoryOmit<ExtArgs> | null
    /**
     * The data needed to update a category.
     */
    data: XOR<categoryUpdateInput, categoryUncheckedUpdateInput>
    /**
     * Choose, which category to update.
     */
    where: categoryWhereUniqueInput
  }

  /**
   * category updateMany
   */
  export type categoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update categories.
     */
    data: XOR<categoryUpdateManyMutationInput, categoryUncheckedUpdateManyInput>
    /**
     * Filter which categories to update
     */
    where?: categoryWhereInput
    /**
     * Limit how many categories to update.
     */
    limit?: number
  }

  /**
   * category upsert
   */
  export type categoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the category
     */
    select?: categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the category
     */
    omit?: categoryOmit<ExtArgs> | null
    /**
     * The filter to search for the category to update in case it exists.
     */
    where: categoryWhereUniqueInput
    /**
     * In case the category found by the `where` argument doesn't exist, create a new category with this data.
     */
    create: XOR<categoryCreateInput, categoryUncheckedCreateInput>
    /**
     * In case the category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<categoryUpdateInput, categoryUncheckedUpdateInput>
  }

  /**
   * category delete
   */
  export type categoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the category
     */
    select?: categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the category
     */
    omit?: categoryOmit<ExtArgs> | null
    /**
     * Filter which category to delete.
     */
    where: categoryWhereUniqueInput
  }

  /**
   * category deleteMany
   */
  export type categoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which categories to delete
     */
    where?: categoryWhereInput
    /**
     * Limit how many categories to delete.
     */
    limit?: number
  }

  /**
   * category without action
   */
  export type categoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the category
     */
    select?: categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the category
     */
    omit?: categoryOmit<ExtArgs> | null
  }


  /**
   * Model dictionary_category
   */

  export type AggregateDictionary_category = {
    _count: Dictionary_categoryCountAggregateOutputType | null
    _avg: Dictionary_categoryAvgAggregateOutputType | null
    _sum: Dictionary_categorySumAggregateOutputType | null
    _min: Dictionary_categoryMinAggregateOutputType | null
    _max: Dictionary_categoryMaxAggregateOutputType | null
  }

  export type Dictionary_categoryAvgAggregateOutputType = {
    id: number | null
    dictionary_id: number | null
    category_id: number | null
    sort_order: number | null
  }

  export type Dictionary_categorySumAggregateOutputType = {
    id: number | null
    dictionary_id: bigint | null
    category_id: number | null
    sort_order: number | null
  }

  export type Dictionary_categoryMinAggregateOutputType = {
    id: number | null
    dictionary_id: bigint | null
    category_id: number | null
    sort_order: number | null
    created_at: Date | null
  }

  export type Dictionary_categoryMaxAggregateOutputType = {
    id: number | null
    dictionary_id: bigint | null
    category_id: number | null
    sort_order: number | null
    created_at: Date | null
  }

  export type Dictionary_categoryCountAggregateOutputType = {
    id: number
    dictionary_id: number
    category_id: number
    sort_order: number
    created_at: number
    _all: number
  }


  export type Dictionary_categoryAvgAggregateInputType = {
    id?: true
    dictionary_id?: true
    category_id?: true
    sort_order?: true
  }

  export type Dictionary_categorySumAggregateInputType = {
    id?: true
    dictionary_id?: true
    category_id?: true
    sort_order?: true
  }

  export type Dictionary_categoryMinAggregateInputType = {
    id?: true
    dictionary_id?: true
    category_id?: true
    sort_order?: true
    created_at?: true
  }

  export type Dictionary_categoryMaxAggregateInputType = {
    id?: true
    dictionary_id?: true
    category_id?: true
    sort_order?: true
    created_at?: true
  }

  export type Dictionary_categoryCountAggregateInputType = {
    id?: true
    dictionary_id?: true
    category_id?: true
    sort_order?: true
    created_at?: true
    _all?: true
  }

  export type Dictionary_categoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which dictionary_category to aggregate.
     */
    where?: dictionary_categoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dictionary_categories to fetch.
     */
    orderBy?: dictionary_categoryOrderByWithRelationInput | dictionary_categoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: dictionary_categoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dictionary_categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dictionary_categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned dictionary_categories
    **/
    _count?: true | Dictionary_categoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Dictionary_categoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Dictionary_categorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Dictionary_categoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Dictionary_categoryMaxAggregateInputType
  }

  export type GetDictionary_categoryAggregateType<T extends Dictionary_categoryAggregateArgs> = {
        [P in keyof T & keyof AggregateDictionary_category]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDictionary_category[P]>
      : GetScalarType<T[P], AggregateDictionary_category[P]>
  }




  export type dictionary_categoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: dictionary_categoryWhereInput
    orderBy?: dictionary_categoryOrderByWithAggregationInput | dictionary_categoryOrderByWithAggregationInput[]
    by: Dictionary_categoryScalarFieldEnum[] | Dictionary_categoryScalarFieldEnum
    having?: dictionary_categoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Dictionary_categoryCountAggregateInputType | true
    _avg?: Dictionary_categoryAvgAggregateInputType
    _sum?: Dictionary_categorySumAggregateInputType
    _min?: Dictionary_categoryMinAggregateInputType
    _max?: Dictionary_categoryMaxAggregateInputType
  }

  export type Dictionary_categoryGroupByOutputType = {
    id: number
    dictionary_id: bigint
    category_id: number
    sort_order: number | null
    created_at: Date | null
    _count: Dictionary_categoryCountAggregateOutputType | null
    _avg: Dictionary_categoryAvgAggregateOutputType | null
    _sum: Dictionary_categorySumAggregateOutputType | null
    _min: Dictionary_categoryMinAggregateOutputType | null
    _max: Dictionary_categoryMaxAggregateOutputType | null
  }

  type GetDictionary_categoryGroupByPayload<T extends dictionary_categoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Dictionary_categoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Dictionary_categoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Dictionary_categoryGroupByOutputType[P]>
            : GetScalarType<T[P], Dictionary_categoryGroupByOutputType[P]>
        }
      >
    >


  export type dictionary_categorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dictionary_id?: boolean
    category_id?: boolean
    sort_order?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["dictionary_category"]>



  export type dictionary_categorySelectScalar = {
    id?: boolean
    dictionary_id?: boolean
    category_id?: boolean
    sort_order?: boolean
    created_at?: boolean
  }

  export type dictionary_categoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "dictionary_id" | "category_id" | "sort_order" | "created_at", ExtArgs["result"]["dictionary_category"]>

  export type $dictionary_categoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "dictionary_category"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      dictionary_id: bigint
      category_id: number
      sort_order: number | null
      created_at: Date | null
    }, ExtArgs["result"]["dictionary_category"]>
    composites: {}
  }

  type dictionary_categoryGetPayload<S extends boolean | null | undefined | dictionary_categoryDefaultArgs> = $Result.GetResult<Prisma.$dictionary_categoryPayload, S>

  type dictionary_categoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<dictionary_categoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Dictionary_categoryCountAggregateInputType | true
    }

  export interface dictionary_categoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['dictionary_category'], meta: { name: 'dictionary_category' } }
    /**
     * Find zero or one Dictionary_category that matches the filter.
     * @param {dictionary_categoryFindUniqueArgs} args - Arguments to find a Dictionary_category
     * @example
     * // Get one Dictionary_category
     * const dictionary_category = await prisma.dictionary_category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends dictionary_categoryFindUniqueArgs>(args: SelectSubset<T, dictionary_categoryFindUniqueArgs<ExtArgs>>): Prisma__dictionary_categoryClient<$Result.GetResult<Prisma.$dictionary_categoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Dictionary_category that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {dictionary_categoryFindUniqueOrThrowArgs} args - Arguments to find a Dictionary_category
     * @example
     * // Get one Dictionary_category
     * const dictionary_category = await prisma.dictionary_category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends dictionary_categoryFindUniqueOrThrowArgs>(args: SelectSubset<T, dictionary_categoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__dictionary_categoryClient<$Result.GetResult<Prisma.$dictionary_categoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Dictionary_category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dictionary_categoryFindFirstArgs} args - Arguments to find a Dictionary_category
     * @example
     * // Get one Dictionary_category
     * const dictionary_category = await prisma.dictionary_category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends dictionary_categoryFindFirstArgs>(args?: SelectSubset<T, dictionary_categoryFindFirstArgs<ExtArgs>>): Prisma__dictionary_categoryClient<$Result.GetResult<Prisma.$dictionary_categoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Dictionary_category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dictionary_categoryFindFirstOrThrowArgs} args - Arguments to find a Dictionary_category
     * @example
     * // Get one Dictionary_category
     * const dictionary_category = await prisma.dictionary_category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends dictionary_categoryFindFirstOrThrowArgs>(args?: SelectSubset<T, dictionary_categoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__dictionary_categoryClient<$Result.GetResult<Prisma.$dictionary_categoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Dictionary_categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dictionary_categoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Dictionary_categories
     * const dictionary_categories = await prisma.dictionary_category.findMany()
     * 
     * // Get first 10 Dictionary_categories
     * const dictionary_categories = await prisma.dictionary_category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dictionary_categoryWithIdOnly = await prisma.dictionary_category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends dictionary_categoryFindManyArgs>(args?: SelectSubset<T, dictionary_categoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$dictionary_categoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Dictionary_category.
     * @param {dictionary_categoryCreateArgs} args - Arguments to create a Dictionary_category.
     * @example
     * // Create one Dictionary_category
     * const Dictionary_category = await prisma.dictionary_category.create({
     *   data: {
     *     // ... data to create a Dictionary_category
     *   }
     * })
     * 
     */
    create<T extends dictionary_categoryCreateArgs>(args: SelectSubset<T, dictionary_categoryCreateArgs<ExtArgs>>): Prisma__dictionary_categoryClient<$Result.GetResult<Prisma.$dictionary_categoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Dictionary_categories.
     * @param {dictionary_categoryCreateManyArgs} args - Arguments to create many Dictionary_categories.
     * @example
     * // Create many Dictionary_categories
     * const dictionary_category = await prisma.dictionary_category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends dictionary_categoryCreateManyArgs>(args?: SelectSubset<T, dictionary_categoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Dictionary_category.
     * @param {dictionary_categoryDeleteArgs} args - Arguments to delete one Dictionary_category.
     * @example
     * // Delete one Dictionary_category
     * const Dictionary_category = await prisma.dictionary_category.delete({
     *   where: {
     *     // ... filter to delete one Dictionary_category
     *   }
     * })
     * 
     */
    delete<T extends dictionary_categoryDeleteArgs>(args: SelectSubset<T, dictionary_categoryDeleteArgs<ExtArgs>>): Prisma__dictionary_categoryClient<$Result.GetResult<Prisma.$dictionary_categoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Dictionary_category.
     * @param {dictionary_categoryUpdateArgs} args - Arguments to update one Dictionary_category.
     * @example
     * // Update one Dictionary_category
     * const dictionary_category = await prisma.dictionary_category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends dictionary_categoryUpdateArgs>(args: SelectSubset<T, dictionary_categoryUpdateArgs<ExtArgs>>): Prisma__dictionary_categoryClient<$Result.GetResult<Prisma.$dictionary_categoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Dictionary_categories.
     * @param {dictionary_categoryDeleteManyArgs} args - Arguments to filter Dictionary_categories to delete.
     * @example
     * // Delete a few Dictionary_categories
     * const { count } = await prisma.dictionary_category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends dictionary_categoryDeleteManyArgs>(args?: SelectSubset<T, dictionary_categoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Dictionary_categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dictionary_categoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Dictionary_categories
     * const dictionary_category = await prisma.dictionary_category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends dictionary_categoryUpdateManyArgs>(args: SelectSubset<T, dictionary_categoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Dictionary_category.
     * @param {dictionary_categoryUpsertArgs} args - Arguments to update or create a Dictionary_category.
     * @example
     * // Update or create a Dictionary_category
     * const dictionary_category = await prisma.dictionary_category.upsert({
     *   create: {
     *     // ... data to create a Dictionary_category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Dictionary_category we want to update
     *   }
     * })
     */
    upsert<T extends dictionary_categoryUpsertArgs>(args: SelectSubset<T, dictionary_categoryUpsertArgs<ExtArgs>>): Prisma__dictionary_categoryClient<$Result.GetResult<Prisma.$dictionary_categoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Dictionary_categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dictionary_categoryCountArgs} args - Arguments to filter Dictionary_categories to count.
     * @example
     * // Count the number of Dictionary_categories
     * const count = await prisma.dictionary_category.count({
     *   where: {
     *     // ... the filter for the Dictionary_categories we want to count
     *   }
     * })
    **/
    count<T extends dictionary_categoryCountArgs>(
      args?: Subset<T, dictionary_categoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Dictionary_categoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Dictionary_category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Dictionary_categoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Dictionary_categoryAggregateArgs>(args: Subset<T, Dictionary_categoryAggregateArgs>): Prisma.PrismaPromise<GetDictionary_categoryAggregateType<T>>

    /**
     * Group by Dictionary_category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dictionary_categoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends dictionary_categoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: dictionary_categoryGroupByArgs['orderBy'] }
        : { orderBy?: dictionary_categoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, dictionary_categoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDictionary_categoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the dictionary_category model
   */
  readonly fields: dictionary_categoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for dictionary_category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__dictionary_categoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the dictionary_category model
   */
  interface dictionary_categoryFieldRefs {
    readonly id: FieldRef<"dictionary_category", 'Int'>
    readonly dictionary_id: FieldRef<"dictionary_category", 'BigInt'>
    readonly category_id: FieldRef<"dictionary_category", 'Int'>
    readonly sort_order: FieldRef<"dictionary_category", 'Int'>
    readonly created_at: FieldRef<"dictionary_category", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * dictionary_category findUnique
   */
  export type dictionary_categoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_category
     */
    select?: dictionary_categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_category
     */
    omit?: dictionary_categoryOmit<ExtArgs> | null
    /**
     * Filter, which dictionary_category to fetch.
     */
    where: dictionary_categoryWhereUniqueInput
  }

  /**
   * dictionary_category findUniqueOrThrow
   */
  export type dictionary_categoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_category
     */
    select?: dictionary_categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_category
     */
    omit?: dictionary_categoryOmit<ExtArgs> | null
    /**
     * Filter, which dictionary_category to fetch.
     */
    where: dictionary_categoryWhereUniqueInput
  }

  /**
   * dictionary_category findFirst
   */
  export type dictionary_categoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_category
     */
    select?: dictionary_categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_category
     */
    omit?: dictionary_categoryOmit<ExtArgs> | null
    /**
     * Filter, which dictionary_category to fetch.
     */
    where?: dictionary_categoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dictionary_categories to fetch.
     */
    orderBy?: dictionary_categoryOrderByWithRelationInput | dictionary_categoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for dictionary_categories.
     */
    cursor?: dictionary_categoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dictionary_categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dictionary_categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of dictionary_categories.
     */
    distinct?: Dictionary_categoryScalarFieldEnum | Dictionary_categoryScalarFieldEnum[]
  }

  /**
   * dictionary_category findFirstOrThrow
   */
  export type dictionary_categoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_category
     */
    select?: dictionary_categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_category
     */
    omit?: dictionary_categoryOmit<ExtArgs> | null
    /**
     * Filter, which dictionary_category to fetch.
     */
    where?: dictionary_categoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dictionary_categories to fetch.
     */
    orderBy?: dictionary_categoryOrderByWithRelationInput | dictionary_categoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for dictionary_categories.
     */
    cursor?: dictionary_categoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dictionary_categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dictionary_categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of dictionary_categories.
     */
    distinct?: Dictionary_categoryScalarFieldEnum | Dictionary_categoryScalarFieldEnum[]
  }

  /**
   * dictionary_category findMany
   */
  export type dictionary_categoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_category
     */
    select?: dictionary_categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_category
     */
    omit?: dictionary_categoryOmit<ExtArgs> | null
    /**
     * Filter, which dictionary_categories to fetch.
     */
    where?: dictionary_categoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dictionary_categories to fetch.
     */
    orderBy?: dictionary_categoryOrderByWithRelationInput | dictionary_categoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing dictionary_categories.
     */
    cursor?: dictionary_categoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dictionary_categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dictionary_categories.
     */
    skip?: number
    distinct?: Dictionary_categoryScalarFieldEnum | Dictionary_categoryScalarFieldEnum[]
  }

  /**
   * dictionary_category create
   */
  export type dictionary_categoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_category
     */
    select?: dictionary_categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_category
     */
    omit?: dictionary_categoryOmit<ExtArgs> | null
    /**
     * The data needed to create a dictionary_category.
     */
    data: XOR<dictionary_categoryCreateInput, dictionary_categoryUncheckedCreateInput>
  }

  /**
   * dictionary_category createMany
   */
  export type dictionary_categoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many dictionary_categories.
     */
    data: dictionary_categoryCreateManyInput | dictionary_categoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * dictionary_category update
   */
  export type dictionary_categoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_category
     */
    select?: dictionary_categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_category
     */
    omit?: dictionary_categoryOmit<ExtArgs> | null
    /**
     * The data needed to update a dictionary_category.
     */
    data: XOR<dictionary_categoryUpdateInput, dictionary_categoryUncheckedUpdateInput>
    /**
     * Choose, which dictionary_category to update.
     */
    where: dictionary_categoryWhereUniqueInput
  }

  /**
   * dictionary_category updateMany
   */
  export type dictionary_categoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update dictionary_categories.
     */
    data: XOR<dictionary_categoryUpdateManyMutationInput, dictionary_categoryUncheckedUpdateManyInput>
    /**
     * Filter which dictionary_categories to update
     */
    where?: dictionary_categoryWhereInput
    /**
     * Limit how many dictionary_categories to update.
     */
    limit?: number
  }

  /**
   * dictionary_category upsert
   */
  export type dictionary_categoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_category
     */
    select?: dictionary_categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_category
     */
    omit?: dictionary_categoryOmit<ExtArgs> | null
    /**
     * The filter to search for the dictionary_category to update in case it exists.
     */
    where: dictionary_categoryWhereUniqueInput
    /**
     * In case the dictionary_category found by the `where` argument doesn't exist, create a new dictionary_category with this data.
     */
    create: XOR<dictionary_categoryCreateInput, dictionary_categoryUncheckedCreateInput>
    /**
     * In case the dictionary_category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<dictionary_categoryUpdateInput, dictionary_categoryUncheckedUpdateInput>
  }

  /**
   * dictionary_category delete
   */
  export type dictionary_categoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_category
     */
    select?: dictionary_categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_category
     */
    omit?: dictionary_categoryOmit<ExtArgs> | null
    /**
     * Filter which dictionary_category to delete.
     */
    where: dictionary_categoryWhereUniqueInput
  }

  /**
   * dictionary_category deleteMany
   */
  export type dictionary_categoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which dictionary_categories to delete
     */
    where?: dictionary_categoryWhereInput
    /**
     * Limit how many dictionary_categories to delete.
     */
    limit?: number
  }

  /**
   * dictionary_category without action
   */
  export type dictionary_categoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_category
     */
    select?: dictionary_categorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_category
     */
    omit?: dictionary_categoryOmit<ExtArgs> | null
  }


  /**
   * Model dictionary_word
   */

  export type AggregateDictionary_word = {
    _count: Dictionary_wordCountAggregateOutputType | null
    _avg: Dictionary_wordAvgAggregateOutputType | null
    _sum: Dictionary_wordSumAggregateOutputType | null
    _min: Dictionary_wordMinAggregateOutputType | null
    _max: Dictionary_wordMaxAggregateOutputType | null
  }

  export type Dictionary_wordAvgAggregateOutputType = {
    dictionary_id: number | null
    word_id: number | null
    id: number | null
  }

  export type Dictionary_wordSumAggregateOutputType = {
    dictionary_id: bigint | null
    word_id: bigint | null
    id: bigint | null
  }

  export type Dictionary_wordMinAggregateOutputType = {
    dictionary_id: bigint | null
    word_id: bigint | null
    created_at: Date | null
    id: bigint | null
  }

  export type Dictionary_wordMaxAggregateOutputType = {
    dictionary_id: bigint | null
    word_id: bigint | null
    created_at: Date | null
    id: bigint | null
  }

  export type Dictionary_wordCountAggregateOutputType = {
    dictionary_id: number
    word_id: number
    created_at: number
    id: number
    _all: number
  }


  export type Dictionary_wordAvgAggregateInputType = {
    dictionary_id?: true
    word_id?: true
    id?: true
  }

  export type Dictionary_wordSumAggregateInputType = {
    dictionary_id?: true
    word_id?: true
    id?: true
  }

  export type Dictionary_wordMinAggregateInputType = {
    dictionary_id?: true
    word_id?: true
    created_at?: true
    id?: true
  }

  export type Dictionary_wordMaxAggregateInputType = {
    dictionary_id?: true
    word_id?: true
    created_at?: true
    id?: true
  }

  export type Dictionary_wordCountAggregateInputType = {
    dictionary_id?: true
    word_id?: true
    created_at?: true
    id?: true
    _all?: true
  }

  export type Dictionary_wordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which dictionary_word to aggregate.
     */
    where?: dictionary_wordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dictionary_words to fetch.
     */
    orderBy?: dictionary_wordOrderByWithRelationInput | dictionary_wordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: dictionary_wordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dictionary_words from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dictionary_words.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned dictionary_words
    **/
    _count?: true | Dictionary_wordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Dictionary_wordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Dictionary_wordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Dictionary_wordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Dictionary_wordMaxAggregateInputType
  }

  export type GetDictionary_wordAggregateType<T extends Dictionary_wordAggregateArgs> = {
        [P in keyof T & keyof AggregateDictionary_word]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDictionary_word[P]>
      : GetScalarType<T[P], AggregateDictionary_word[P]>
  }




  export type dictionary_wordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: dictionary_wordWhereInput
    orderBy?: dictionary_wordOrderByWithAggregationInput | dictionary_wordOrderByWithAggregationInput[]
    by: Dictionary_wordScalarFieldEnum[] | Dictionary_wordScalarFieldEnum
    having?: dictionary_wordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Dictionary_wordCountAggregateInputType | true
    _avg?: Dictionary_wordAvgAggregateInputType
    _sum?: Dictionary_wordSumAggregateInputType
    _min?: Dictionary_wordMinAggregateInputType
    _max?: Dictionary_wordMaxAggregateInputType
  }

  export type Dictionary_wordGroupByOutputType = {
    dictionary_id: bigint
    word_id: bigint
    created_at: Date | null
    id: bigint | null
    _count: Dictionary_wordCountAggregateOutputType | null
    _avg: Dictionary_wordAvgAggregateOutputType | null
    _sum: Dictionary_wordSumAggregateOutputType | null
    _min: Dictionary_wordMinAggregateOutputType | null
    _max: Dictionary_wordMaxAggregateOutputType | null
  }

  type GetDictionary_wordGroupByPayload<T extends dictionary_wordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Dictionary_wordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Dictionary_wordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Dictionary_wordGroupByOutputType[P]>
            : GetScalarType<T[P], Dictionary_wordGroupByOutputType[P]>
        }
      >
    >


  export type dictionary_wordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    dictionary_id?: boolean
    word_id?: boolean
    created_at?: boolean
    id?: boolean
    english_dictionary?: boolean | english_dictionaryDefaultArgs<ExtArgs>
    english_word?: boolean | english_wordDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dictionary_word"]>



  export type dictionary_wordSelectScalar = {
    dictionary_id?: boolean
    word_id?: boolean
    created_at?: boolean
    id?: boolean
  }

  export type dictionary_wordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"dictionary_id" | "word_id" | "created_at" | "id", ExtArgs["result"]["dictionary_word"]>
  export type dictionary_wordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    english_dictionary?: boolean | english_dictionaryDefaultArgs<ExtArgs>
    english_word?: boolean | english_wordDefaultArgs<ExtArgs>
  }

  export type $dictionary_wordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "dictionary_word"
    objects: {
      english_dictionary: Prisma.$english_dictionaryPayload<ExtArgs>
      english_word: Prisma.$english_wordPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      dictionary_id: bigint
      word_id: bigint
      created_at: Date | null
      id: bigint | null
    }, ExtArgs["result"]["dictionary_word"]>
    composites: {}
  }

  type dictionary_wordGetPayload<S extends boolean | null | undefined | dictionary_wordDefaultArgs> = $Result.GetResult<Prisma.$dictionary_wordPayload, S>

  type dictionary_wordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<dictionary_wordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Dictionary_wordCountAggregateInputType | true
    }

  export interface dictionary_wordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['dictionary_word'], meta: { name: 'dictionary_word' } }
    /**
     * Find zero or one Dictionary_word that matches the filter.
     * @param {dictionary_wordFindUniqueArgs} args - Arguments to find a Dictionary_word
     * @example
     * // Get one Dictionary_word
     * const dictionary_word = await prisma.dictionary_word.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends dictionary_wordFindUniqueArgs>(args: SelectSubset<T, dictionary_wordFindUniqueArgs<ExtArgs>>): Prisma__dictionary_wordClient<$Result.GetResult<Prisma.$dictionary_wordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Dictionary_word that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {dictionary_wordFindUniqueOrThrowArgs} args - Arguments to find a Dictionary_word
     * @example
     * // Get one Dictionary_word
     * const dictionary_word = await prisma.dictionary_word.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends dictionary_wordFindUniqueOrThrowArgs>(args: SelectSubset<T, dictionary_wordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__dictionary_wordClient<$Result.GetResult<Prisma.$dictionary_wordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Dictionary_word that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dictionary_wordFindFirstArgs} args - Arguments to find a Dictionary_word
     * @example
     * // Get one Dictionary_word
     * const dictionary_word = await prisma.dictionary_word.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends dictionary_wordFindFirstArgs>(args?: SelectSubset<T, dictionary_wordFindFirstArgs<ExtArgs>>): Prisma__dictionary_wordClient<$Result.GetResult<Prisma.$dictionary_wordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Dictionary_word that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dictionary_wordFindFirstOrThrowArgs} args - Arguments to find a Dictionary_word
     * @example
     * // Get one Dictionary_word
     * const dictionary_word = await prisma.dictionary_word.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends dictionary_wordFindFirstOrThrowArgs>(args?: SelectSubset<T, dictionary_wordFindFirstOrThrowArgs<ExtArgs>>): Prisma__dictionary_wordClient<$Result.GetResult<Prisma.$dictionary_wordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Dictionary_words that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dictionary_wordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Dictionary_words
     * const dictionary_words = await prisma.dictionary_word.findMany()
     * 
     * // Get first 10 Dictionary_words
     * const dictionary_words = await prisma.dictionary_word.findMany({ take: 10 })
     * 
     * // Only select the `dictionary_id`
     * const dictionary_wordWithDictionary_idOnly = await prisma.dictionary_word.findMany({ select: { dictionary_id: true } })
     * 
     */
    findMany<T extends dictionary_wordFindManyArgs>(args?: SelectSubset<T, dictionary_wordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$dictionary_wordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Dictionary_word.
     * @param {dictionary_wordCreateArgs} args - Arguments to create a Dictionary_word.
     * @example
     * // Create one Dictionary_word
     * const Dictionary_word = await prisma.dictionary_word.create({
     *   data: {
     *     // ... data to create a Dictionary_word
     *   }
     * })
     * 
     */
    create<T extends dictionary_wordCreateArgs>(args: SelectSubset<T, dictionary_wordCreateArgs<ExtArgs>>): Prisma__dictionary_wordClient<$Result.GetResult<Prisma.$dictionary_wordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Dictionary_words.
     * @param {dictionary_wordCreateManyArgs} args - Arguments to create many Dictionary_words.
     * @example
     * // Create many Dictionary_words
     * const dictionary_word = await prisma.dictionary_word.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends dictionary_wordCreateManyArgs>(args?: SelectSubset<T, dictionary_wordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Dictionary_word.
     * @param {dictionary_wordDeleteArgs} args - Arguments to delete one Dictionary_word.
     * @example
     * // Delete one Dictionary_word
     * const Dictionary_word = await prisma.dictionary_word.delete({
     *   where: {
     *     // ... filter to delete one Dictionary_word
     *   }
     * })
     * 
     */
    delete<T extends dictionary_wordDeleteArgs>(args: SelectSubset<T, dictionary_wordDeleteArgs<ExtArgs>>): Prisma__dictionary_wordClient<$Result.GetResult<Prisma.$dictionary_wordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Dictionary_word.
     * @param {dictionary_wordUpdateArgs} args - Arguments to update one Dictionary_word.
     * @example
     * // Update one Dictionary_word
     * const dictionary_word = await prisma.dictionary_word.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends dictionary_wordUpdateArgs>(args: SelectSubset<T, dictionary_wordUpdateArgs<ExtArgs>>): Prisma__dictionary_wordClient<$Result.GetResult<Prisma.$dictionary_wordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Dictionary_words.
     * @param {dictionary_wordDeleteManyArgs} args - Arguments to filter Dictionary_words to delete.
     * @example
     * // Delete a few Dictionary_words
     * const { count } = await prisma.dictionary_word.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends dictionary_wordDeleteManyArgs>(args?: SelectSubset<T, dictionary_wordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Dictionary_words.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dictionary_wordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Dictionary_words
     * const dictionary_word = await prisma.dictionary_word.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends dictionary_wordUpdateManyArgs>(args: SelectSubset<T, dictionary_wordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Dictionary_word.
     * @param {dictionary_wordUpsertArgs} args - Arguments to update or create a Dictionary_word.
     * @example
     * // Update or create a Dictionary_word
     * const dictionary_word = await prisma.dictionary_word.upsert({
     *   create: {
     *     // ... data to create a Dictionary_word
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Dictionary_word we want to update
     *   }
     * })
     */
    upsert<T extends dictionary_wordUpsertArgs>(args: SelectSubset<T, dictionary_wordUpsertArgs<ExtArgs>>): Prisma__dictionary_wordClient<$Result.GetResult<Prisma.$dictionary_wordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Dictionary_words.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dictionary_wordCountArgs} args - Arguments to filter Dictionary_words to count.
     * @example
     * // Count the number of Dictionary_words
     * const count = await prisma.dictionary_word.count({
     *   where: {
     *     // ... the filter for the Dictionary_words we want to count
     *   }
     * })
    **/
    count<T extends dictionary_wordCountArgs>(
      args?: Subset<T, dictionary_wordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Dictionary_wordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Dictionary_word.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Dictionary_wordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Dictionary_wordAggregateArgs>(args: Subset<T, Dictionary_wordAggregateArgs>): Prisma.PrismaPromise<GetDictionary_wordAggregateType<T>>

    /**
     * Group by Dictionary_word.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dictionary_wordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends dictionary_wordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: dictionary_wordGroupByArgs['orderBy'] }
        : { orderBy?: dictionary_wordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, dictionary_wordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDictionary_wordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the dictionary_word model
   */
  readonly fields: dictionary_wordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for dictionary_word.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__dictionary_wordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    english_dictionary<T extends english_dictionaryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, english_dictionaryDefaultArgs<ExtArgs>>): Prisma__english_dictionaryClient<$Result.GetResult<Prisma.$english_dictionaryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    english_word<T extends english_wordDefaultArgs<ExtArgs> = {}>(args?: Subset<T, english_wordDefaultArgs<ExtArgs>>): Prisma__english_wordClient<$Result.GetResult<Prisma.$english_wordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the dictionary_word model
   */
  interface dictionary_wordFieldRefs {
    readonly dictionary_id: FieldRef<"dictionary_word", 'BigInt'>
    readonly word_id: FieldRef<"dictionary_word", 'BigInt'>
    readonly created_at: FieldRef<"dictionary_word", 'DateTime'>
    readonly id: FieldRef<"dictionary_word", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * dictionary_word findUnique
   */
  export type dictionary_wordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_word
     */
    select?: dictionary_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_word
     */
    omit?: dictionary_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dictionary_wordInclude<ExtArgs> | null
    /**
     * Filter, which dictionary_word to fetch.
     */
    where: dictionary_wordWhereUniqueInput
  }

  /**
   * dictionary_word findUniqueOrThrow
   */
  export type dictionary_wordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_word
     */
    select?: dictionary_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_word
     */
    omit?: dictionary_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dictionary_wordInclude<ExtArgs> | null
    /**
     * Filter, which dictionary_word to fetch.
     */
    where: dictionary_wordWhereUniqueInput
  }

  /**
   * dictionary_word findFirst
   */
  export type dictionary_wordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_word
     */
    select?: dictionary_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_word
     */
    omit?: dictionary_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dictionary_wordInclude<ExtArgs> | null
    /**
     * Filter, which dictionary_word to fetch.
     */
    where?: dictionary_wordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dictionary_words to fetch.
     */
    orderBy?: dictionary_wordOrderByWithRelationInput | dictionary_wordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for dictionary_words.
     */
    cursor?: dictionary_wordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dictionary_words from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dictionary_words.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of dictionary_words.
     */
    distinct?: Dictionary_wordScalarFieldEnum | Dictionary_wordScalarFieldEnum[]
  }

  /**
   * dictionary_word findFirstOrThrow
   */
  export type dictionary_wordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_word
     */
    select?: dictionary_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_word
     */
    omit?: dictionary_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dictionary_wordInclude<ExtArgs> | null
    /**
     * Filter, which dictionary_word to fetch.
     */
    where?: dictionary_wordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dictionary_words to fetch.
     */
    orderBy?: dictionary_wordOrderByWithRelationInput | dictionary_wordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for dictionary_words.
     */
    cursor?: dictionary_wordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dictionary_words from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dictionary_words.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of dictionary_words.
     */
    distinct?: Dictionary_wordScalarFieldEnum | Dictionary_wordScalarFieldEnum[]
  }

  /**
   * dictionary_word findMany
   */
  export type dictionary_wordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_word
     */
    select?: dictionary_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_word
     */
    omit?: dictionary_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dictionary_wordInclude<ExtArgs> | null
    /**
     * Filter, which dictionary_words to fetch.
     */
    where?: dictionary_wordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dictionary_words to fetch.
     */
    orderBy?: dictionary_wordOrderByWithRelationInput | dictionary_wordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing dictionary_words.
     */
    cursor?: dictionary_wordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dictionary_words from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dictionary_words.
     */
    skip?: number
    distinct?: Dictionary_wordScalarFieldEnum | Dictionary_wordScalarFieldEnum[]
  }

  /**
   * dictionary_word create
   */
  export type dictionary_wordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_word
     */
    select?: dictionary_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_word
     */
    omit?: dictionary_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dictionary_wordInclude<ExtArgs> | null
    /**
     * The data needed to create a dictionary_word.
     */
    data: XOR<dictionary_wordCreateInput, dictionary_wordUncheckedCreateInput>
  }

  /**
   * dictionary_word createMany
   */
  export type dictionary_wordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many dictionary_words.
     */
    data: dictionary_wordCreateManyInput | dictionary_wordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * dictionary_word update
   */
  export type dictionary_wordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_word
     */
    select?: dictionary_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_word
     */
    omit?: dictionary_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dictionary_wordInclude<ExtArgs> | null
    /**
     * The data needed to update a dictionary_word.
     */
    data: XOR<dictionary_wordUpdateInput, dictionary_wordUncheckedUpdateInput>
    /**
     * Choose, which dictionary_word to update.
     */
    where: dictionary_wordWhereUniqueInput
  }

  /**
   * dictionary_word updateMany
   */
  export type dictionary_wordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update dictionary_words.
     */
    data: XOR<dictionary_wordUpdateManyMutationInput, dictionary_wordUncheckedUpdateManyInput>
    /**
     * Filter which dictionary_words to update
     */
    where?: dictionary_wordWhereInput
    /**
     * Limit how many dictionary_words to update.
     */
    limit?: number
  }

  /**
   * dictionary_word upsert
   */
  export type dictionary_wordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_word
     */
    select?: dictionary_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_word
     */
    omit?: dictionary_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dictionary_wordInclude<ExtArgs> | null
    /**
     * The filter to search for the dictionary_word to update in case it exists.
     */
    where: dictionary_wordWhereUniqueInput
    /**
     * In case the dictionary_word found by the `where` argument doesn't exist, create a new dictionary_word with this data.
     */
    create: XOR<dictionary_wordCreateInput, dictionary_wordUncheckedCreateInput>
    /**
     * In case the dictionary_word was found with the provided `where` argument, update it with this data.
     */
    update: XOR<dictionary_wordUpdateInput, dictionary_wordUncheckedUpdateInput>
  }

  /**
   * dictionary_word delete
   */
  export type dictionary_wordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_word
     */
    select?: dictionary_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_word
     */
    omit?: dictionary_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dictionary_wordInclude<ExtArgs> | null
    /**
     * Filter which dictionary_word to delete.
     */
    where: dictionary_wordWhereUniqueInput
  }

  /**
   * dictionary_word deleteMany
   */
  export type dictionary_wordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which dictionary_words to delete
     */
    where?: dictionary_wordWhereInput
    /**
     * Limit how many dictionary_words to delete.
     */
    limit?: number
  }

  /**
   * dictionary_word without action
   */
  export type dictionary_wordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_word
     */
    select?: dictionary_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_word
     */
    omit?: dictionary_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dictionary_wordInclude<ExtArgs> | null
  }


  /**
   * Model english_dictionary
   */

  export type AggregateEnglish_dictionary = {
    _count: English_dictionaryCountAggregateOutputType | null
    _avg: English_dictionaryAvgAggregateOutputType | null
    _sum: English_dictionarySumAggregateOutputType | null
    _min: English_dictionaryMinAggregateOutputType | null
    _max: English_dictionaryMaxAggregateOutputType | null
  }

  export type English_dictionaryAvgAggregateOutputType = {
    id: number | null
    total_words: number | null
    published_words: number | null
    approved_words: number | null
  }

  export type English_dictionarySumAggregateOutputType = {
    id: bigint | null
    total_words: number | null
    published_words: number | null
    approved_words: number | null
  }

  export type English_dictionaryMinAggregateOutputType = {
    id: bigint | null
    name: string | null
    description: string | null
    image_url: string | null
    author: string | null
    isbn: string | null
    publication_date: Date | null
    publisher: string | null
    create_time: Date | null
    update_time: Date | null
    is_delete: boolean | null
    total_words: number | null
    published_words: number | null
    approved_words: number | null
  }

  export type English_dictionaryMaxAggregateOutputType = {
    id: bigint | null
    name: string | null
    description: string | null
    image_url: string | null
    author: string | null
    isbn: string | null
    publication_date: Date | null
    publisher: string | null
    create_time: Date | null
    update_time: Date | null
    is_delete: boolean | null
    total_words: number | null
    published_words: number | null
    approved_words: number | null
  }

  export type English_dictionaryCountAggregateOutputType = {
    id: number
    name: number
    description: number
    image_url: number
    author: number
    isbn: number
    publication_date: number
    publisher: number
    create_time: number
    update_time: number
    is_delete: number
    total_words: number
    published_words: number
    approved_words: number
    _all: number
  }


  export type English_dictionaryAvgAggregateInputType = {
    id?: true
    total_words?: true
    published_words?: true
    approved_words?: true
  }

  export type English_dictionarySumAggregateInputType = {
    id?: true
    total_words?: true
    published_words?: true
    approved_words?: true
  }

  export type English_dictionaryMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    image_url?: true
    author?: true
    isbn?: true
    publication_date?: true
    publisher?: true
    create_time?: true
    update_time?: true
    is_delete?: true
    total_words?: true
    published_words?: true
    approved_words?: true
  }

  export type English_dictionaryMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    image_url?: true
    author?: true
    isbn?: true
    publication_date?: true
    publisher?: true
    create_time?: true
    update_time?: true
    is_delete?: true
    total_words?: true
    published_words?: true
    approved_words?: true
  }

  export type English_dictionaryCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    image_url?: true
    author?: true
    isbn?: true
    publication_date?: true
    publisher?: true
    create_time?: true
    update_time?: true
    is_delete?: true
    total_words?: true
    published_words?: true
    approved_words?: true
    _all?: true
  }

  export type English_dictionaryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which english_dictionary to aggregate.
     */
    where?: english_dictionaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of english_dictionaries to fetch.
     */
    orderBy?: english_dictionaryOrderByWithRelationInput | english_dictionaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: english_dictionaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` english_dictionaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` english_dictionaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned english_dictionaries
    **/
    _count?: true | English_dictionaryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: English_dictionaryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: English_dictionarySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: English_dictionaryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: English_dictionaryMaxAggregateInputType
  }

  export type GetEnglish_dictionaryAggregateType<T extends English_dictionaryAggregateArgs> = {
        [P in keyof T & keyof AggregateEnglish_dictionary]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEnglish_dictionary[P]>
      : GetScalarType<T[P], AggregateEnglish_dictionary[P]>
  }




  export type english_dictionaryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: english_dictionaryWhereInput
    orderBy?: english_dictionaryOrderByWithAggregationInput | english_dictionaryOrderByWithAggregationInput[]
    by: English_dictionaryScalarFieldEnum[] | English_dictionaryScalarFieldEnum
    having?: english_dictionaryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: English_dictionaryCountAggregateInputType | true
    _avg?: English_dictionaryAvgAggregateInputType
    _sum?: English_dictionarySumAggregateInputType
    _min?: English_dictionaryMinAggregateInputType
    _max?: English_dictionaryMaxAggregateInputType
  }

  export type English_dictionaryGroupByOutputType = {
    id: bigint
    name: string | null
    description: string | null
    image_url: string | null
    author: string | null
    isbn: string | null
    publication_date: Date | null
    publisher: string | null
    create_time: Date | null
    update_time: Date | null
    is_delete: boolean | null
    total_words: number | null
    published_words: number | null
    approved_words: number | null
    _count: English_dictionaryCountAggregateOutputType | null
    _avg: English_dictionaryAvgAggregateOutputType | null
    _sum: English_dictionarySumAggregateOutputType | null
    _min: English_dictionaryMinAggregateOutputType | null
    _max: English_dictionaryMaxAggregateOutputType | null
  }

  type GetEnglish_dictionaryGroupByPayload<T extends english_dictionaryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<English_dictionaryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof English_dictionaryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], English_dictionaryGroupByOutputType[P]>
            : GetScalarType<T[P], English_dictionaryGroupByOutputType[P]>
        }
      >
    >


  export type english_dictionarySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    image_url?: boolean
    author?: boolean
    isbn?: boolean
    publication_date?: boolean
    publisher?: boolean
    create_time?: boolean
    update_time?: boolean
    is_delete?: boolean
    total_words?: boolean
    published_words?: boolean
    approved_words?: boolean
    dictionary_word?: boolean | english_dictionary$dictionary_wordArgs<ExtArgs>
    _count?: boolean | English_dictionaryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["english_dictionary"]>



  export type english_dictionarySelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    image_url?: boolean
    author?: boolean
    isbn?: boolean
    publication_date?: boolean
    publisher?: boolean
    create_time?: boolean
    update_time?: boolean
    is_delete?: boolean
    total_words?: boolean
    published_words?: boolean
    approved_words?: boolean
  }

  export type english_dictionaryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "image_url" | "author" | "isbn" | "publication_date" | "publisher" | "create_time" | "update_time" | "is_delete" | "total_words" | "published_words" | "approved_words", ExtArgs["result"]["english_dictionary"]>
  export type english_dictionaryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dictionary_word?: boolean | english_dictionary$dictionary_wordArgs<ExtArgs>
    _count?: boolean | English_dictionaryCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $english_dictionaryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "english_dictionary"
    objects: {
      dictionary_word: Prisma.$dictionary_wordPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      name: string | null
      description: string | null
      image_url: string | null
      author: string | null
      isbn: string | null
      publication_date: Date | null
      publisher: string | null
      create_time: Date | null
      update_time: Date | null
      is_delete: boolean | null
      total_words: number | null
      published_words: number | null
      approved_words: number | null
    }, ExtArgs["result"]["english_dictionary"]>
    composites: {}
  }

  type english_dictionaryGetPayload<S extends boolean | null | undefined | english_dictionaryDefaultArgs> = $Result.GetResult<Prisma.$english_dictionaryPayload, S>

  type english_dictionaryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<english_dictionaryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: English_dictionaryCountAggregateInputType | true
    }

  export interface english_dictionaryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['english_dictionary'], meta: { name: 'english_dictionary' } }
    /**
     * Find zero or one English_dictionary that matches the filter.
     * @param {english_dictionaryFindUniqueArgs} args - Arguments to find a English_dictionary
     * @example
     * // Get one English_dictionary
     * const english_dictionary = await prisma.english_dictionary.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends english_dictionaryFindUniqueArgs>(args: SelectSubset<T, english_dictionaryFindUniqueArgs<ExtArgs>>): Prisma__english_dictionaryClient<$Result.GetResult<Prisma.$english_dictionaryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one English_dictionary that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {english_dictionaryFindUniqueOrThrowArgs} args - Arguments to find a English_dictionary
     * @example
     * // Get one English_dictionary
     * const english_dictionary = await prisma.english_dictionary.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends english_dictionaryFindUniqueOrThrowArgs>(args: SelectSubset<T, english_dictionaryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__english_dictionaryClient<$Result.GetResult<Prisma.$english_dictionaryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first English_dictionary that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {english_dictionaryFindFirstArgs} args - Arguments to find a English_dictionary
     * @example
     * // Get one English_dictionary
     * const english_dictionary = await prisma.english_dictionary.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends english_dictionaryFindFirstArgs>(args?: SelectSubset<T, english_dictionaryFindFirstArgs<ExtArgs>>): Prisma__english_dictionaryClient<$Result.GetResult<Prisma.$english_dictionaryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first English_dictionary that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {english_dictionaryFindFirstOrThrowArgs} args - Arguments to find a English_dictionary
     * @example
     * // Get one English_dictionary
     * const english_dictionary = await prisma.english_dictionary.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends english_dictionaryFindFirstOrThrowArgs>(args?: SelectSubset<T, english_dictionaryFindFirstOrThrowArgs<ExtArgs>>): Prisma__english_dictionaryClient<$Result.GetResult<Prisma.$english_dictionaryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more English_dictionaries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {english_dictionaryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all English_dictionaries
     * const english_dictionaries = await prisma.english_dictionary.findMany()
     * 
     * // Get first 10 English_dictionaries
     * const english_dictionaries = await prisma.english_dictionary.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const english_dictionaryWithIdOnly = await prisma.english_dictionary.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends english_dictionaryFindManyArgs>(args?: SelectSubset<T, english_dictionaryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$english_dictionaryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a English_dictionary.
     * @param {english_dictionaryCreateArgs} args - Arguments to create a English_dictionary.
     * @example
     * // Create one English_dictionary
     * const English_dictionary = await prisma.english_dictionary.create({
     *   data: {
     *     // ... data to create a English_dictionary
     *   }
     * })
     * 
     */
    create<T extends english_dictionaryCreateArgs>(args: SelectSubset<T, english_dictionaryCreateArgs<ExtArgs>>): Prisma__english_dictionaryClient<$Result.GetResult<Prisma.$english_dictionaryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many English_dictionaries.
     * @param {english_dictionaryCreateManyArgs} args - Arguments to create many English_dictionaries.
     * @example
     * // Create many English_dictionaries
     * const english_dictionary = await prisma.english_dictionary.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends english_dictionaryCreateManyArgs>(args?: SelectSubset<T, english_dictionaryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a English_dictionary.
     * @param {english_dictionaryDeleteArgs} args - Arguments to delete one English_dictionary.
     * @example
     * // Delete one English_dictionary
     * const English_dictionary = await prisma.english_dictionary.delete({
     *   where: {
     *     // ... filter to delete one English_dictionary
     *   }
     * })
     * 
     */
    delete<T extends english_dictionaryDeleteArgs>(args: SelectSubset<T, english_dictionaryDeleteArgs<ExtArgs>>): Prisma__english_dictionaryClient<$Result.GetResult<Prisma.$english_dictionaryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one English_dictionary.
     * @param {english_dictionaryUpdateArgs} args - Arguments to update one English_dictionary.
     * @example
     * // Update one English_dictionary
     * const english_dictionary = await prisma.english_dictionary.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends english_dictionaryUpdateArgs>(args: SelectSubset<T, english_dictionaryUpdateArgs<ExtArgs>>): Prisma__english_dictionaryClient<$Result.GetResult<Prisma.$english_dictionaryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more English_dictionaries.
     * @param {english_dictionaryDeleteManyArgs} args - Arguments to filter English_dictionaries to delete.
     * @example
     * // Delete a few English_dictionaries
     * const { count } = await prisma.english_dictionary.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends english_dictionaryDeleteManyArgs>(args?: SelectSubset<T, english_dictionaryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more English_dictionaries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {english_dictionaryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many English_dictionaries
     * const english_dictionary = await prisma.english_dictionary.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends english_dictionaryUpdateManyArgs>(args: SelectSubset<T, english_dictionaryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one English_dictionary.
     * @param {english_dictionaryUpsertArgs} args - Arguments to update or create a English_dictionary.
     * @example
     * // Update or create a English_dictionary
     * const english_dictionary = await prisma.english_dictionary.upsert({
     *   create: {
     *     // ... data to create a English_dictionary
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the English_dictionary we want to update
     *   }
     * })
     */
    upsert<T extends english_dictionaryUpsertArgs>(args: SelectSubset<T, english_dictionaryUpsertArgs<ExtArgs>>): Prisma__english_dictionaryClient<$Result.GetResult<Prisma.$english_dictionaryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of English_dictionaries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {english_dictionaryCountArgs} args - Arguments to filter English_dictionaries to count.
     * @example
     * // Count the number of English_dictionaries
     * const count = await prisma.english_dictionary.count({
     *   where: {
     *     // ... the filter for the English_dictionaries we want to count
     *   }
     * })
    **/
    count<T extends english_dictionaryCountArgs>(
      args?: Subset<T, english_dictionaryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], English_dictionaryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a English_dictionary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {English_dictionaryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends English_dictionaryAggregateArgs>(args: Subset<T, English_dictionaryAggregateArgs>): Prisma.PrismaPromise<GetEnglish_dictionaryAggregateType<T>>

    /**
     * Group by English_dictionary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {english_dictionaryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends english_dictionaryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: english_dictionaryGroupByArgs['orderBy'] }
        : { orderBy?: english_dictionaryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, english_dictionaryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEnglish_dictionaryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the english_dictionary model
   */
  readonly fields: english_dictionaryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for english_dictionary.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__english_dictionaryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dictionary_word<T extends english_dictionary$dictionary_wordArgs<ExtArgs> = {}>(args?: Subset<T, english_dictionary$dictionary_wordArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$dictionary_wordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the english_dictionary model
   */
  interface english_dictionaryFieldRefs {
    readonly id: FieldRef<"english_dictionary", 'BigInt'>
    readonly name: FieldRef<"english_dictionary", 'String'>
    readonly description: FieldRef<"english_dictionary", 'String'>
    readonly image_url: FieldRef<"english_dictionary", 'String'>
    readonly author: FieldRef<"english_dictionary", 'String'>
    readonly isbn: FieldRef<"english_dictionary", 'String'>
    readonly publication_date: FieldRef<"english_dictionary", 'DateTime'>
    readonly publisher: FieldRef<"english_dictionary", 'String'>
    readonly create_time: FieldRef<"english_dictionary", 'DateTime'>
    readonly update_time: FieldRef<"english_dictionary", 'DateTime'>
    readonly is_delete: FieldRef<"english_dictionary", 'Boolean'>
    readonly total_words: FieldRef<"english_dictionary", 'Int'>
    readonly published_words: FieldRef<"english_dictionary", 'Int'>
    readonly approved_words: FieldRef<"english_dictionary", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * english_dictionary findUnique
   */
  export type english_dictionaryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_dictionary
     */
    select?: english_dictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_dictionary
     */
    omit?: english_dictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_dictionaryInclude<ExtArgs> | null
    /**
     * Filter, which english_dictionary to fetch.
     */
    where: english_dictionaryWhereUniqueInput
  }

  /**
   * english_dictionary findUniqueOrThrow
   */
  export type english_dictionaryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_dictionary
     */
    select?: english_dictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_dictionary
     */
    omit?: english_dictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_dictionaryInclude<ExtArgs> | null
    /**
     * Filter, which english_dictionary to fetch.
     */
    where: english_dictionaryWhereUniqueInput
  }

  /**
   * english_dictionary findFirst
   */
  export type english_dictionaryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_dictionary
     */
    select?: english_dictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_dictionary
     */
    omit?: english_dictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_dictionaryInclude<ExtArgs> | null
    /**
     * Filter, which english_dictionary to fetch.
     */
    where?: english_dictionaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of english_dictionaries to fetch.
     */
    orderBy?: english_dictionaryOrderByWithRelationInput | english_dictionaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for english_dictionaries.
     */
    cursor?: english_dictionaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` english_dictionaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` english_dictionaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of english_dictionaries.
     */
    distinct?: English_dictionaryScalarFieldEnum | English_dictionaryScalarFieldEnum[]
  }

  /**
   * english_dictionary findFirstOrThrow
   */
  export type english_dictionaryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_dictionary
     */
    select?: english_dictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_dictionary
     */
    omit?: english_dictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_dictionaryInclude<ExtArgs> | null
    /**
     * Filter, which english_dictionary to fetch.
     */
    where?: english_dictionaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of english_dictionaries to fetch.
     */
    orderBy?: english_dictionaryOrderByWithRelationInput | english_dictionaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for english_dictionaries.
     */
    cursor?: english_dictionaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` english_dictionaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` english_dictionaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of english_dictionaries.
     */
    distinct?: English_dictionaryScalarFieldEnum | English_dictionaryScalarFieldEnum[]
  }

  /**
   * english_dictionary findMany
   */
  export type english_dictionaryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_dictionary
     */
    select?: english_dictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_dictionary
     */
    omit?: english_dictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_dictionaryInclude<ExtArgs> | null
    /**
     * Filter, which english_dictionaries to fetch.
     */
    where?: english_dictionaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of english_dictionaries to fetch.
     */
    orderBy?: english_dictionaryOrderByWithRelationInput | english_dictionaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing english_dictionaries.
     */
    cursor?: english_dictionaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` english_dictionaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` english_dictionaries.
     */
    skip?: number
    distinct?: English_dictionaryScalarFieldEnum | English_dictionaryScalarFieldEnum[]
  }

  /**
   * english_dictionary create
   */
  export type english_dictionaryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_dictionary
     */
    select?: english_dictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_dictionary
     */
    omit?: english_dictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_dictionaryInclude<ExtArgs> | null
    /**
     * The data needed to create a english_dictionary.
     */
    data: XOR<english_dictionaryCreateInput, english_dictionaryUncheckedCreateInput>
  }

  /**
   * english_dictionary createMany
   */
  export type english_dictionaryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many english_dictionaries.
     */
    data: english_dictionaryCreateManyInput | english_dictionaryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * english_dictionary update
   */
  export type english_dictionaryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_dictionary
     */
    select?: english_dictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_dictionary
     */
    omit?: english_dictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_dictionaryInclude<ExtArgs> | null
    /**
     * The data needed to update a english_dictionary.
     */
    data: XOR<english_dictionaryUpdateInput, english_dictionaryUncheckedUpdateInput>
    /**
     * Choose, which english_dictionary to update.
     */
    where: english_dictionaryWhereUniqueInput
  }

  /**
   * english_dictionary updateMany
   */
  export type english_dictionaryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update english_dictionaries.
     */
    data: XOR<english_dictionaryUpdateManyMutationInput, english_dictionaryUncheckedUpdateManyInput>
    /**
     * Filter which english_dictionaries to update
     */
    where?: english_dictionaryWhereInput
    /**
     * Limit how many english_dictionaries to update.
     */
    limit?: number
  }

  /**
   * english_dictionary upsert
   */
  export type english_dictionaryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_dictionary
     */
    select?: english_dictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_dictionary
     */
    omit?: english_dictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_dictionaryInclude<ExtArgs> | null
    /**
     * The filter to search for the english_dictionary to update in case it exists.
     */
    where: english_dictionaryWhereUniqueInput
    /**
     * In case the english_dictionary found by the `where` argument doesn't exist, create a new english_dictionary with this data.
     */
    create: XOR<english_dictionaryCreateInput, english_dictionaryUncheckedCreateInput>
    /**
     * In case the english_dictionary was found with the provided `where` argument, update it with this data.
     */
    update: XOR<english_dictionaryUpdateInput, english_dictionaryUncheckedUpdateInput>
  }

  /**
   * english_dictionary delete
   */
  export type english_dictionaryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_dictionary
     */
    select?: english_dictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_dictionary
     */
    omit?: english_dictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_dictionaryInclude<ExtArgs> | null
    /**
     * Filter which english_dictionary to delete.
     */
    where: english_dictionaryWhereUniqueInput
  }

  /**
   * english_dictionary deleteMany
   */
  export type english_dictionaryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which english_dictionaries to delete
     */
    where?: english_dictionaryWhereInput
    /**
     * Limit how many english_dictionaries to delete.
     */
    limit?: number
  }

  /**
   * english_dictionary.dictionary_word
   */
  export type english_dictionary$dictionary_wordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_word
     */
    select?: dictionary_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_word
     */
    omit?: dictionary_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dictionary_wordInclude<ExtArgs> | null
    where?: dictionary_wordWhereInput
    orderBy?: dictionary_wordOrderByWithRelationInput | dictionary_wordOrderByWithRelationInput[]
    cursor?: dictionary_wordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Dictionary_wordScalarFieldEnum | Dictionary_wordScalarFieldEnum[]
  }

  /**
   * english_dictionary without action
   */
  export type english_dictionaryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_dictionary
     */
    select?: english_dictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_dictionary
     */
    omit?: english_dictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_dictionaryInclude<ExtArgs> | null
  }


  /**
   * Model english_word
   */

  export type AggregateEnglish_word = {
    _count: English_wordCountAggregateOutputType | null
    _avg: English_wordAvgAggregateOutputType | null
    _sum: English_wordSumAggregateOutputType | null
    _min: English_wordMinAggregateOutputType | null
    _max: English_wordMaxAggregateOutputType | null
  }

  export type English_wordAvgAggregateOutputType = {
    id: number | null
    manual_score: number | null
    ai_score: number | null
    reviewer: number | null
  }

  export type English_wordSumAggregateOutputType = {
    id: bigint | null
    manual_score: number | null
    ai_score: number | null
    reviewer: bigint | null
  }

  export type English_wordMinAggregateOutputType = {
    id: bigint | null
    word_head: string | null
    thumbnail: string | null
    create_time: Date | null
    update_time: Date | null
    is_delete: boolean | null
    status: string | null
    manual_score: number | null
    ai_score: number | null
    reviewer: bigint | null
  }

  export type English_wordMaxAggregateOutputType = {
    id: bigint | null
    word_head: string | null
    thumbnail: string | null
    create_time: Date | null
    update_time: Date | null
    is_delete: boolean | null
    status: string | null
    manual_score: number | null
    ai_score: number | null
    reviewer: bigint | null
  }

  export type English_wordCountAggregateOutputType = {
    id: number
    word_head: number
    thumbnail: number
    info: number
    create_time: number
    update_time: number
    is_delete: number
    status: number
    manual_score: number
    ai_score: number
    reviewer: number
    _all: number
  }


  export type English_wordAvgAggregateInputType = {
    id?: true
    manual_score?: true
    ai_score?: true
    reviewer?: true
  }

  export type English_wordSumAggregateInputType = {
    id?: true
    manual_score?: true
    ai_score?: true
    reviewer?: true
  }

  export type English_wordMinAggregateInputType = {
    id?: true
    word_head?: true
    thumbnail?: true
    create_time?: true
    update_time?: true
    is_delete?: true
    status?: true
    manual_score?: true
    ai_score?: true
    reviewer?: true
  }

  export type English_wordMaxAggregateInputType = {
    id?: true
    word_head?: true
    thumbnail?: true
    create_time?: true
    update_time?: true
    is_delete?: true
    status?: true
    manual_score?: true
    ai_score?: true
    reviewer?: true
  }

  export type English_wordCountAggregateInputType = {
    id?: true
    word_head?: true
    thumbnail?: true
    info?: true
    create_time?: true
    update_time?: true
    is_delete?: true
    status?: true
    manual_score?: true
    ai_score?: true
    reviewer?: true
    _all?: true
  }

  export type English_wordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which english_word to aggregate.
     */
    where?: english_wordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of english_words to fetch.
     */
    orderBy?: english_wordOrderByWithRelationInput | english_wordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: english_wordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` english_words from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` english_words.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned english_words
    **/
    _count?: true | English_wordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: English_wordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: English_wordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: English_wordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: English_wordMaxAggregateInputType
  }

  export type GetEnglish_wordAggregateType<T extends English_wordAggregateArgs> = {
        [P in keyof T & keyof AggregateEnglish_word]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEnglish_word[P]>
      : GetScalarType<T[P], AggregateEnglish_word[P]>
  }




  export type english_wordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: english_wordWhereInput
    orderBy?: english_wordOrderByWithAggregationInput | english_wordOrderByWithAggregationInput[]
    by: English_wordScalarFieldEnum[] | English_wordScalarFieldEnum
    having?: english_wordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: English_wordCountAggregateInputType | true
    _avg?: English_wordAvgAggregateInputType
    _sum?: English_wordSumAggregateInputType
    _min?: English_wordMinAggregateInputType
    _max?: English_wordMaxAggregateInputType
  }

  export type English_wordGroupByOutputType = {
    id: bigint
    word_head: string | null
    thumbnail: string | null
    info: JsonValue | null
    create_time: Date | null
    update_time: Date | null
    is_delete: boolean | null
    status: string | null
    manual_score: number | null
    ai_score: number | null
    reviewer: bigint | null
    _count: English_wordCountAggregateOutputType | null
    _avg: English_wordAvgAggregateOutputType | null
    _sum: English_wordSumAggregateOutputType | null
    _min: English_wordMinAggregateOutputType | null
    _max: English_wordMaxAggregateOutputType | null
  }

  type GetEnglish_wordGroupByPayload<T extends english_wordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<English_wordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof English_wordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], English_wordGroupByOutputType[P]>
            : GetScalarType<T[P], English_wordGroupByOutputType[P]>
        }
      >
    >


  export type english_wordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    word_head?: boolean
    thumbnail?: boolean
    info?: boolean
    create_time?: boolean
    update_time?: boolean
    is_delete?: boolean
    status?: boolean
    manual_score?: boolean
    ai_score?: boolean
    reviewer?: boolean
    dictionary_word?: boolean | english_word$dictionary_wordArgs<ExtArgs>
    english_word_change_log?: boolean | english_word$english_word_change_logArgs<ExtArgs>
    media_creator?: boolean | english_word$media_creatorArgs<ExtArgs>
    _count?: boolean | English_wordCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["english_word"]>



  export type english_wordSelectScalar = {
    id?: boolean
    word_head?: boolean
    thumbnail?: boolean
    info?: boolean
    create_time?: boolean
    update_time?: boolean
    is_delete?: boolean
    status?: boolean
    manual_score?: boolean
    ai_score?: boolean
    reviewer?: boolean
  }

  export type english_wordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "word_head" | "thumbnail" | "info" | "create_time" | "update_time" | "is_delete" | "status" | "manual_score" | "ai_score" | "reviewer", ExtArgs["result"]["english_word"]>
  export type english_wordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dictionary_word?: boolean | english_word$dictionary_wordArgs<ExtArgs>
    english_word_change_log?: boolean | english_word$english_word_change_logArgs<ExtArgs>
    media_creator?: boolean | english_word$media_creatorArgs<ExtArgs>
    _count?: boolean | English_wordCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $english_wordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "english_word"
    objects: {
      dictionary_word: Prisma.$dictionary_wordPayload<ExtArgs>[]
      english_word_change_log: Prisma.$english_word_change_logPayload<ExtArgs>[]
      media_creator: Prisma.$media_creatorPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      word_head: string | null
      thumbnail: string | null
      info: Prisma.JsonValue | null
      create_time: Date | null
      update_time: Date | null
      is_delete: boolean | null
      status: string | null
      manual_score: number | null
      ai_score: number | null
      reviewer: bigint | null
    }, ExtArgs["result"]["english_word"]>
    composites: {}
  }

  type english_wordGetPayload<S extends boolean | null | undefined | english_wordDefaultArgs> = $Result.GetResult<Prisma.$english_wordPayload, S>

  type english_wordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<english_wordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: English_wordCountAggregateInputType | true
    }

  export interface english_wordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['english_word'], meta: { name: 'english_word' } }
    /**
     * Find zero or one English_word that matches the filter.
     * @param {english_wordFindUniqueArgs} args - Arguments to find a English_word
     * @example
     * // Get one English_word
     * const english_word = await prisma.english_word.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends english_wordFindUniqueArgs>(args: SelectSubset<T, english_wordFindUniqueArgs<ExtArgs>>): Prisma__english_wordClient<$Result.GetResult<Prisma.$english_wordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one English_word that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {english_wordFindUniqueOrThrowArgs} args - Arguments to find a English_word
     * @example
     * // Get one English_word
     * const english_word = await prisma.english_word.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends english_wordFindUniqueOrThrowArgs>(args: SelectSubset<T, english_wordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__english_wordClient<$Result.GetResult<Prisma.$english_wordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first English_word that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {english_wordFindFirstArgs} args - Arguments to find a English_word
     * @example
     * // Get one English_word
     * const english_word = await prisma.english_word.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends english_wordFindFirstArgs>(args?: SelectSubset<T, english_wordFindFirstArgs<ExtArgs>>): Prisma__english_wordClient<$Result.GetResult<Prisma.$english_wordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first English_word that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {english_wordFindFirstOrThrowArgs} args - Arguments to find a English_word
     * @example
     * // Get one English_word
     * const english_word = await prisma.english_word.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends english_wordFindFirstOrThrowArgs>(args?: SelectSubset<T, english_wordFindFirstOrThrowArgs<ExtArgs>>): Prisma__english_wordClient<$Result.GetResult<Prisma.$english_wordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more English_words that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {english_wordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all English_words
     * const english_words = await prisma.english_word.findMany()
     * 
     * // Get first 10 English_words
     * const english_words = await prisma.english_word.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const english_wordWithIdOnly = await prisma.english_word.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends english_wordFindManyArgs>(args?: SelectSubset<T, english_wordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$english_wordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a English_word.
     * @param {english_wordCreateArgs} args - Arguments to create a English_word.
     * @example
     * // Create one English_word
     * const English_word = await prisma.english_word.create({
     *   data: {
     *     // ... data to create a English_word
     *   }
     * })
     * 
     */
    create<T extends english_wordCreateArgs>(args: SelectSubset<T, english_wordCreateArgs<ExtArgs>>): Prisma__english_wordClient<$Result.GetResult<Prisma.$english_wordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many English_words.
     * @param {english_wordCreateManyArgs} args - Arguments to create many English_words.
     * @example
     * // Create many English_words
     * const english_word = await prisma.english_word.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends english_wordCreateManyArgs>(args?: SelectSubset<T, english_wordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a English_word.
     * @param {english_wordDeleteArgs} args - Arguments to delete one English_word.
     * @example
     * // Delete one English_word
     * const English_word = await prisma.english_word.delete({
     *   where: {
     *     // ... filter to delete one English_word
     *   }
     * })
     * 
     */
    delete<T extends english_wordDeleteArgs>(args: SelectSubset<T, english_wordDeleteArgs<ExtArgs>>): Prisma__english_wordClient<$Result.GetResult<Prisma.$english_wordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one English_word.
     * @param {english_wordUpdateArgs} args - Arguments to update one English_word.
     * @example
     * // Update one English_word
     * const english_word = await prisma.english_word.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends english_wordUpdateArgs>(args: SelectSubset<T, english_wordUpdateArgs<ExtArgs>>): Prisma__english_wordClient<$Result.GetResult<Prisma.$english_wordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more English_words.
     * @param {english_wordDeleteManyArgs} args - Arguments to filter English_words to delete.
     * @example
     * // Delete a few English_words
     * const { count } = await prisma.english_word.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends english_wordDeleteManyArgs>(args?: SelectSubset<T, english_wordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more English_words.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {english_wordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many English_words
     * const english_word = await prisma.english_word.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends english_wordUpdateManyArgs>(args: SelectSubset<T, english_wordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one English_word.
     * @param {english_wordUpsertArgs} args - Arguments to update or create a English_word.
     * @example
     * // Update or create a English_word
     * const english_word = await prisma.english_word.upsert({
     *   create: {
     *     // ... data to create a English_word
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the English_word we want to update
     *   }
     * })
     */
    upsert<T extends english_wordUpsertArgs>(args: SelectSubset<T, english_wordUpsertArgs<ExtArgs>>): Prisma__english_wordClient<$Result.GetResult<Prisma.$english_wordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of English_words.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {english_wordCountArgs} args - Arguments to filter English_words to count.
     * @example
     * // Count the number of English_words
     * const count = await prisma.english_word.count({
     *   where: {
     *     // ... the filter for the English_words we want to count
     *   }
     * })
    **/
    count<T extends english_wordCountArgs>(
      args?: Subset<T, english_wordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], English_wordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a English_word.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {English_wordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends English_wordAggregateArgs>(args: Subset<T, English_wordAggregateArgs>): Prisma.PrismaPromise<GetEnglish_wordAggregateType<T>>

    /**
     * Group by English_word.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {english_wordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends english_wordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: english_wordGroupByArgs['orderBy'] }
        : { orderBy?: english_wordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, english_wordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEnglish_wordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the english_word model
   */
  readonly fields: english_wordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for english_word.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__english_wordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dictionary_word<T extends english_word$dictionary_wordArgs<ExtArgs> = {}>(args?: Subset<T, english_word$dictionary_wordArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$dictionary_wordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    english_word_change_log<T extends english_word$english_word_change_logArgs<ExtArgs> = {}>(args?: Subset<T, english_word$english_word_change_logArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$english_word_change_logPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    media_creator<T extends english_word$media_creatorArgs<ExtArgs> = {}>(args?: Subset<T, english_word$media_creatorArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$media_creatorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the english_word model
   */
  interface english_wordFieldRefs {
    readonly id: FieldRef<"english_word", 'BigInt'>
    readonly word_head: FieldRef<"english_word", 'String'>
    readonly thumbnail: FieldRef<"english_word", 'String'>
    readonly info: FieldRef<"english_word", 'Json'>
    readonly create_time: FieldRef<"english_word", 'DateTime'>
    readonly update_time: FieldRef<"english_word", 'DateTime'>
    readonly is_delete: FieldRef<"english_word", 'Boolean'>
    readonly status: FieldRef<"english_word", 'String'>
    readonly manual_score: FieldRef<"english_word", 'Int'>
    readonly ai_score: FieldRef<"english_word", 'Int'>
    readonly reviewer: FieldRef<"english_word", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * english_word findUnique
   */
  export type english_wordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word
     */
    select?: english_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word
     */
    omit?: english_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_wordInclude<ExtArgs> | null
    /**
     * Filter, which english_word to fetch.
     */
    where: english_wordWhereUniqueInput
  }

  /**
   * english_word findUniqueOrThrow
   */
  export type english_wordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word
     */
    select?: english_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word
     */
    omit?: english_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_wordInclude<ExtArgs> | null
    /**
     * Filter, which english_word to fetch.
     */
    where: english_wordWhereUniqueInput
  }

  /**
   * english_word findFirst
   */
  export type english_wordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word
     */
    select?: english_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word
     */
    omit?: english_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_wordInclude<ExtArgs> | null
    /**
     * Filter, which english_word to fetch.
     */
    where?: english_wordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of english_words to fetch.
     */
    orderBy?: english_wordOrderByWithRelationInput | english_wordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for english_words.
     */
    cursor?: english_wordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` english_words from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` english_words.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of english_words.
     */
    distinct?: English_wordScalarFieldEnum | English_wordScalarFieldEnum[]
  }

  /**
   * english_word findFirstOrThrow
   */
  export type english_wordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word
     */
    select?: english_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word
     */
    omit?: english_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_wordInclude<ExtArgs> | null
    /**
     * Filter, which english_word to fetch.
     */
    where?: english_wordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of english_words to fetch.
     */
    orderBy?: english_wordOrderByWithRelationInput | english_wordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for english_words.
     */
    cursor?: english_wordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` english_words from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` english_words.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of english_words.
     */
    distinct?: English_wordScalarFieldEnum | English_wordScalarFieldEnum[]
  }

  /**
   * english_word findMany
   */
  export type english_wordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word
     */
    select?: english_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word
     */
    omit?: english_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_wordInclude<ExtArgs> | null
    /**
     * Filter, which english_words to fetch.
     */
    where?: english_wordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of english_words to fetch.
     */
    orderBy?: english_wordOrderByWithRelationInput | english_wordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing english_words.
     */
    cursor?: english_wordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` english_words from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` english_words.
     */
    skip?: number
    distinct?: English_wordScalarFieldEnum | English_wordScalarFieldEnum[]
  }

  /**
   * english_word create
   */
  export type english_wordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word
     */
    select?: english_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word
     */
    omit?: english_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_wordInclude<ExtArgs> | null
    /**
     * The data needed to create a english_word.
     */
    data: XOR<english_wordCreateInput, english_wordUncheckedCreateInput>
  }

  /**
   * english_word createMany
   */
  export type english_wordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many english_words.
     */
    data: english_wordCreateManyInput | english_wordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * english_word update
   */
  export type english_wordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word
     */
    select?: english_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word
     */
    omit?: english_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_wordInclude<ExtArgs> | null
    /**
     * The data needed to update a english_word.
     */
    data: XOR<english_wordUpdateInput, english_wordUncheckedUpdateInput>
    /**
     * Choose, which english_word to update.
     */
    where: english_wordWhereUniqueInput
  }

  /**
   * english_word updateMany
   */
  export type english_wordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update english_words.
     */
    data: XOR<english_wordUpdateManyMutationInput, english_wordUncheckedUpdateManyInput>
    /**
     * Filter which english_words to update
     */
    where?: english_wordWhereInput
    /**
     * Limit how many english_words to update.
     */
    limit?: number
  }

  /**
   * english_word upsert
   */
  export type english_wordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word
     */
    select?: english_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word
     */
    omit?: english_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_wordInclude<ExtArgs> | null
    /**
     * The filter to search for the english_word to update in case it exists.
     */
    where: english_wordWhereUniqueInput
    /**
     * In case the english_word found by the `where` argument doesn't exist, create a new english_word with this data.
     */
    create: XOR<english_wordCreateInput, english_wordUncheckedCreateInput>
    /**
     * In case the english_word was found with the provided `where` argument, update it with this data.
     */
    update: XOR<english_wordUpdateInput, english_wordUncheckedUpdateInput>
  }

  /**
   * english_word delete
   */
  export type english_wordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word
     */
    select?: english_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word
     */
    omit?: english_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_wordInclude<ExtArgs> | null
    /**
     * Filter which english_word to delete.
     */
    where: english_wordWhereUniqueInput
  }

  /**
   * english_word deleteMany
   */
  export type english_wordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which english_words to delete
     */
    where?: english_wordWhereInput
    /**
     * Limit how many english_words to delete.
     */
    limit?: number
  }

  /**
   * english_word.dictionary_word
   */
  export type english_word$dictionary_wordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dictionary_word
     */
    select?: dictionary_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dictionary_word
     */
    omit?: dictionary_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: dictionary_wordInclude<ExtArgs> | null
    where?: dictionary_wordWhereInput
    orderBy?: dictionary_wordOrderByWithRelationInput | dictionary_wordOrderByWithRelationInput[]
    cursor?: dictionary_wordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Dictionary_wordScalarFieldEnum | Dictionary_wordScalarFieldEnum[]
  }

  /**
   * english_word.english_word_change_log
   */
  export type english_word$english_word_change_logArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word_change_log
     */
    select?: english_word_change_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word_change_log
     */
    omit?: english_word_change_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_word_change_logInclude<ExtArgs> | null
    where?: english_word_change_logWhereInput
    orderBy?: english_word_change_logOrderByWithRelationInput | english_word_change_logOrderByWithRelationInput[]
    cursor?: english_word_change_logWhereUniqueInput
    take?: number
    skip?: number
    distinct?: English_word_change_logScalarFieldEnum | English_word_change_logScalarFieldEnum[]
  }

  /**
   * english_word.media_creator
   */
  export type english_word$media_creatorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the media_creator
     */
    select?: media_creatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the media_creator
     */
    omit?: media_creatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: media_creatorInclude<ExtArgs> | null
    where?: media_creatorWhereInput
    orderBy?: media_creatorOrderByWithRelationInput | media_creatorOrderByWithRelationInput[]
    cursor?: media_creatorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Media_creatorScalarFieldEnum | Media_creatorScalarFieldEnum[]
  }

  /**
   * english_word without action
   */
  export type english_wordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word
     */
    select?: english_wordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word
     */
    omit?: english_wordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_wordInclude<ExtArgs> | null
  }


  /**
   * Model english_word_change_log
   */

  export type AggregateEnglish_word_change_log = {
    _count: English_word_change_logCountAggregateOutputType | null
    _avg: English_word_change_logAvgAggregateOutputType | null
    _sum: English_word_change_logSumAggregateOutputType | null
    _min: English_word_change_logMinAggregateOutputType | null
    _max: English_word_change_logMaxAggregateOutputType | null
  }

  export type English_word_change_logAvgAggregateOutputType = {
    id: number | null
    english_word_id: number | null
    changed_by: number | null
  }

  export type English_word_change_logSumAggregateOutputType = {
    id: bigint | null
    english_word_id: bigint | null
    changed_by: bigint | null
  }

  export type English_word_change_logMinAggregateOutputType = {
    id: bigint | null
    english_word_id: bigint | null
    field_name: string | null
    old_value: string | null
    new_value: string | null
    change_time: Date | null
    changed_by: bigint | null
  }

  export type English_word_change_logMaxAggregateOutputType = {
    id: bigint | null
    english_word_id: bigint | null
    field_name: string | null
    old_value: string | null
    new_value: string | null
    change_time: Date | null
    changed_by: bigint | null
  }

  export type English_word_change_logCountAggregateOutputType = {
    id: number
    english_word_id: number
    field_name: number
    old_value: number
    new_value: number
    change_time: number
    changed_by: number
    _all: number
  }


  export type English_word_change_logAvgAggregateInputType = {
    id?: true
    english_word_id?: true
    changed_by?: true
  }

  export type English_word_change_logSumAggregateInputType = {
    id?: true
    english_word_id?: true
    changed_by?: true
  }

  export type English_word_change_logMinAggregateInputType = {
    id?: true
    english_word_id?: true
    field_name?: true
    old_value?: true
    new_value?: true
    change_time?: true
    changed_by?: true
  }

  export type English_word_change_logMaxAggregateInputType = {
    id?: true
    english_word_id?: true
    field_name?: true
    old_value?: true
    new_value?: true
    change_time?: true
    changed_by?: true
  }

  export type English_word_change_logCountAggregateInputType = {
    id?: true
    english_word_id?: true
    field_name?: true
    old_value?: true
    new_value?: true
    change_time?: true
    changed_by?: true
    _all?: true
  }

  export type English_word_change_logAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which english_word_change_log to aggregate.
     */
    where?: english_word_change_logWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of english_word_change_logs to fetch.
     */
    orderBy?: english_word_change_logOrderByWithRelationInput | english_word_change_logOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: english_word_change_logWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` english_word_change_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` english_word_change_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned english_word_change_logs
    **/
    _count?: true | English_word_change_logCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: English_word_change_logAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: English_word_change_logSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: English_word_change_logMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: English_word_change_logMaxAggregateInputType
  }

  export type GetEnglish_word_change_logAggregateType<T extends English_word_change_logAggregateArgs> = {
        [P in keyof T & keyof AggregateEnglish_word_change_log]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEnglish_word_change_log[P]>
      : GetScalarType<T[P], AggregateEnglish_word_change_log[P]>
  }




  export type english_word_change_logGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: english_word_change_logWhereInput
    orderBy?: english_word_change_logOrderByWithAggregationInput | english_word_change_logOrderByWithAggregationInput[]
    by: English_word_change_logScalarFieldEnum[] | English_word_change_logScalarFieldEnum
    having?: english_word_change_logScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: English_word_change_logCountAggregateInputType | true
    _avg?: English_word_change_logAvgAggregateInputType
    _sum?: English_word_change_logSumAggregateInputType
    _min?: English_word_change_logMinAggregateInputType
    _max?: English_word_change_logMaxAggregateInputType
  }

  export type English_word_change_logGroupByOutputType = {
    id: bigint
    english_word_id: bigint
    field_name: string
    old_value: string | null
    new_value: string | null
    change_time: Date
    changed_by: bigint | null
    _count: English_word_change_logCountAggregateOutputType | null
    _avg: English_word_change_logAvgAggregateOutputType | null
    _sum: English_word_change_logSumAggregateOutputType | null
    _min: English_word_change_logMinAggregateOutputType | null
    _max: English_word_change_logMaxAggregateOutputType | null
  }

  type GetEnglish_word_change_logGroupByPayload<T extends english_word_change_logGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<English_word_change_logGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof English_word_change_logGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], English_word_change_logGroupByOutputType[P]>
            : GetScalarType<T[P], English_word_change_logGroupByOutputType[P]>
        }
      >
    >


  export type english_word_change_logSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    english_word_id?: boolean
    field_name?: boolean
    old_value?: boolean
    new_value?: boolean
    change_time?: boolean
    changed_by?: boolean
    english_word?: boolean | english_wordDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["english_word_change_log"]>



  export type english_word_change_logSelectScalar = {
    id?: boolean
    english_word_id?: boolean
    field_name?: boolean
    old_value?: boolean
    new_value?: boolean
    change_time?: boolean
    changed_by?: boolean
  }

  export type english_word_change_logOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "english_word_id" | "field_name" | "old_value" | "new_value" | "change_time" | "changed_by", ExtArgs["result"]["english_word_change_log"]>
  export type english_word_change_logInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    english_word?: boolean | english_wordDefaultArgs<ExtArgs>
  }

  export type $english_word_change_logPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "english_word_change_log"
    objects: {
      english_word: Prisma.$english_wordPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      english_word_id: bigint
      field_name: string
      old_value: string | null
      new_value: string | null
      change_time: Date
      changed_by: bigint | null
    }, ExtArgs["result"]["english_word_change_log"]>
    composites: {}
  }

  type english_word_change_logGetPayload<S extends boolean | null | undefined | english_word_change_logDefaultArgs> = $Result.GetResult<Prisma.$english_word_change_logPayload, S>

  type english_word_change_logCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<english_word_change_logFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: English_word_change_logCountAggregateInputType | true
    }

  export interface english_word_change_logDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['english_word_change_log'], meta: { name: 'english_word_change_log' } }
    /**
     * Find zero or one English_word_change_log that matches the filter.
     * @param {english_word_change_logFindUniqueArgs} args - Arguments to find a English_word_change_log
     * @example
     * // Get one English_word_change_log
     * const english_word_change_log = await prisma.english_word_change_log.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends english_word_change_logFindUniqueArgs>(args: SelectSubset<T, english_word_change_logFindUniqueArgs<ExtArgs>>): Prisma__english_word_change_logClient<$Result.GetResult<Prisma.$english_word_change_logPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one English_word_change_log that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {english_word_change_logFindUniqueOrThrowArgs} args - Arguments to find a English_word_change_log
     * @example
     * // Get one English_word_change_log
     * const english_word_change_log = await prisma.english_word_change_log.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends english_word_change_logFindUniqueOrThrowArgs>(args: SelectSubset<T, english_word_change_logFindUniqueOrThrowArgs<ExtArgs>>): Prisma__english_word_change_logClient<$Result.GetResult<Prisma.$english_word_change_logPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first English_word_change_log that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {english_word_change_logFindFirstArgs} args - Arguments to find a English_word_change_log
     * @example
     * // Get one English_word_change_log
     * const english_word_change_log = await prisma.english_word_change_log.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends english_word_change_logFindFirstArgs>(args?: SelectSubset<T, english_word_change_logFindFirstArgs<ExtArgs>>): Prisma__english_word_change_logClient<$Result.GetResult<Prisma.$english_word_change_logPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first English_word_change_log that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {english_word_change_logFindFirstOrThrowArgs} args - Arguments to find a English_word_change_log
     * @example
     * // Get one English_word_change_log
     * const english_word_change_log = await prisma.english_word_change_log.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends english_word_change_logFindFirstOrThrowArgs>(args?: SelectSubset<T, english_word_change_logFindFirstOrThrowArgs<ExtArgs>>): Prisma__english_word_change_logClient<$Result.GetResult<Prisma.$english_word_change_logPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more English_word_change_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {english_word_change_logFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all English_word_change_logs
     * const english_word_change_logs = await prisma.english_word_change_log.findMany()
     * 
     * // Get first 10 English_word_change_logs
     * const english_word_change_logs = await prisma.english_word_change_log.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const english_word_change_logWithIdOnly = await prisma.english_word_change_log.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends english_word_change_logFindManyArgs>(args?: SelectSubset<T, english_word_change_logFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$english_word_change_logPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a English_word_change_log.
     * @param {english_word_change_logCreateArgs} args - Arguments to create a English_word_change_log.
     * @example
     * // Create one English_word_change_log
     * const English_word_change_log = await prisma.english_word_change_log.create({
     *   data: {
     *     // ... data to create a English_word_change_log
     *   }
     * })
     * 
     */
    create<T extends english_word_change_logCreateArgs>(args: SelectSubset<T, english_word_change_logCreateArgs<ExtArgs>>): Prisma__english_word_change_logClient<$Result.GetResult<Prisma.$english_word_change_logPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many English_word_change_logs.
     * @param {english_word_change_logCreateManyArgs} args - Arguments to create many English_word_change_logs.
     * @example
     * // Create many English_word_change_logs
     * const english_word_change_log = await prisma.english_word_change_log.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends english_word_change_logCreateManyArgs>(args?: SelectSubset<T, english_word_change_logCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a English_word_change_log.
     * @param {english_word_change_logDeleteArgs} args - Arguments to delete one English_word_change_log.
     * @example
     * // Delete one English_word_change_log
     * const English_word_change_log = await prisma.english_word_change_log.delete({
     *   where: {
     *     // ... filter to delete one English_word_change_log
     *   }
     * })
     * 
     */
    delete<T extends english_word_change_logDeleteArgs>(args: SelectSubset<T, english_word_change_logDeleteArgs<ExtArgs>>): Prisma__english_word_change_logClient<$Result.GetResult<Prisma.$english_word_change_logPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one English_word_change_log.
     * @param {english_word_change_logUpdateArgs} args - Arguments to update one English_word_change_log.
     * @example
     * // Update one English_word_change_log
     * const english_word_change_log = await prisma.english_word_change_log.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends english_word_change_logUpdateArgs>(args: SelectSubset<T, english_word_change_logUpdateArgs<ExtArgs>>): Prisma__english_word_change_logClient<$Result.GetResult<Prisma.$english_word_change_logPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more English_word_change_logs.
     * @param {english_word_change_logDeleteManyArgs} args - Arguments to filter English_word_change_logs to delete.
     * @example
     * // Delete a few English_word_change_logs
     * const { count } = await prisma.english_word_change_log.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends english_word_change_logDeleteManyArgs>(args?: SelectSubset<T, english_word_change_logDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more English_word_change_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {english_word_change_logUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many English_word_change_logs
     * const english_word_change_log = await prisma.english_word_change_log.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends english_word_change_logUpdateManyArgs>(args: SelectSubset<T, english_word_change_logUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one English_word_change_log.
     * @param {english_word_change_logUpsertArgs} args - Arguments to update or create a English_word_change_log.
     * @example
     * // Update or create a English_word_change_log
     * const english_word_change_log = await prisma.english_word_change_log.upsert({
     *   create: {
     *     // ... data to create a English_word_change_log
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the English_word_change_log we want to update
     *   }
     * })
     */
    upsert<T extends english_word_change_logUpsertArgs>(args: SelectSubset<T, english_word_change_logUpsertArgs<ExtArgs>>): Prisma__english_word_change_logClient<$Result.GetResult<Prisma.$english_word_change_logPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of English_word_change_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {english_word_change_logCountArgs} args - Arguments to filter English_word_change_logs to count.
     * @example
     * // Count the number of English_word_change_logs
     * const count = await prisma.english_word_change_log.count({
     *   where: {
     *     // ... the filter for the English_word_change_logs we want to count
     *   }
     * })
    **/
    count<T extends english_word_change_logCountArgs>(
      args?: Subset<T, english_word_change_logCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], English_word_change_logCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a English_word_change_log.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {English_word_change_logAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends English_word_change_logAggregateArgs>(args: Subset<T, English_word_change_logAggregateArgs>): Prisma.PrismaPromise<GetEnglish_word_change_logAggregateType<T>>

    /**
     * Group by English_word_change_log.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {english_word_change_logGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends english_word_change_logGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: english_word_change_logGroupByArgs['orderBy'] }
        : { orderBy?: english_word_change_logGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, english_word_change_logGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEnglish_word_change_logGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the english_word_change_log model
   */
  readonly fields: english_word_change_logFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for english_word_change_log.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__english_word_change_logClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    english_word<T extends english_wordDefaultArgs<ExtArgs> = {}>(args?: Subset<T, english_wordDefaultArgs<ExtArgs>>): Prisma__english_wordClient<$Result.GetResult<Prisma.$english_wordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the english_word_change_log model
   */
  interface english_word_change_logFieldRefs {
    readonly id: FieldRef<"english_word_change_log", 'BigInt'>
    readonly english_word_id: FieldRef<"english_word_change_log", 'BigInt'>
    readonly field_name: FieldRef<"english_word_change_log", 'String'>
    readonly old_value: FieldRef<"english_word_change_log", 'String'>
    readonly new_value: FieldRef<"english_word_change_log", 'String'>
    readonly change_time: FieldRef<"english_word_change_log", 'DateTime'>
    readonly changed_by: FieldRef<"english_word_change_log", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * english_word_change_log findUnique
   */
  export type english_word_change_logFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word_change_log
     */
    select?: english_word_change_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word_change_log
     */
    omit?: english_word_change_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_word_change_logInclude<ExtArgs> | null
    /**
     * Filter, which english_word_change_log to fetch.
     */
    where: english_word_change_logWhereUniqueInput
  }

  /**
   * english_word_change_log findUniqueOrThrow
   */
  export type english_word_change_logFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word_change_log
     */
    select?: english_word_change_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word_change_log
     */
    omit?: english_word_change_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_word_change_logInclude<ExtArgs> | null
    /**
     * Filter, which english_word_change_log to fetch.
     */
    where: english_word_change_logWhereUniqueInput
  }

  /**
   * english_word_change_log findFirst
   */
  export type english_word_change_logFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word_change_log
     */
    select?: english_word_change_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word_change_log
     */
    omit?: english_word_change_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_word_change_logInclude<ExtArgs> | null
    /**
     * Filter, which english_word_change_log to fetch.
     */
    where?: english_word_change_logWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of english_word_change_logs to fetch.
     */
    orderBy?: english_word_change_logOrderByWithRelationInput | english_word_change_logOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for english_word_change_logs.
     */
    cursor?: english_word_change_logWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` english_word_change_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` english_word_change_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of english_word_change_logs.
     */
    distinct?: English_word_change_logScalarFieldEnum | English_word_change_logScalarFieldEnum[]
  }

  /**
   * english_word_change_log findFirstOrThrow
   */
  export type english_word_change_logFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word_change_log
     */
    select?: english_word_change_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word_change_log
     */
    omit?: english_word_change_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_word_change_logInclude<ExtArgs> | null
    /**
     * Filter, which english_word_change_log to fetch.
     */
    where?: english_word_change_logWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of english_word_change_logs to fetch.
     */
    orderBy?: english_word_change_logOrderByWithRelationInput | english_word_change_logOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for english_word_change_logs.
     */
    cursor?: english_word_change_logWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` english_word_change_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` english_word_change_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of english_word_change_logs.
     */
    distinct?: English_word_change_logScalarFieldEnum | English_word_change_logScalarFieldEnum[]
  }

  /**
   * english_word_change_log findMany
   */
  export type english_word_change_logFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word_change_log
     */
    select?: english_word_change_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word_change_log
     */
    omit?: english_word_change_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_word_change_logInclude<ExtArgs> | null
    /**
     * Filter, which english_word_change_logs to fetch.
     */
    where?: english_word_change_logWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of english_word_change_logs to fetch.
     */
    orderBy?: english_word_change_logOrderByWithRelationInput | english_word_change_logOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing english_word_change_logs.
     */
    cursor?: english_word_change_logWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` english_word_change_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` english_word_change_logs.
     */
    skip?: number
    distinct?: English_word_change_logScalarFieldEnum | English_word_change_logScalarFieldEnum[]
  }

  /**
   * english_word_change_log create
   */
  export type english_word_change_logCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word_change_log
     */
    select?: english_word_change_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word_change_log
     */
    omit?: english_word_change_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_word_change_logInclude<ExtArgs> | null
    /**
     * The data needed to create a english_word_change_log.
     */
    data: XOR<english_word_change_logCreateInput, english_word_change_logUncheckedCreateInput>
  }

  /**
   * english_word_change_log createMany
   */
  export type english_word_change_logCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many english_word_change_logs.
     */
    data: english_word_change_logCreateManyInput | english_word_change_logCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * english_word_change_log update
   */
  export type english_word_change_logUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word_change_log
     */
    select?: english_word_change_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word_change_log
     */
    omit?: english_word_change_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_word_change_logInclude<ExtArgs> | null
    /**
     * The data needed to update a english_word_change_log.
     */
    data: XOR<english_word_change_logUpdateInput, english_word_change_logUncheckedUpdateInput>
    /**
     * Choose, which english_word_change_log to update.
     */
    where: english_word_change_logWhereUniqueInput
  }

  /**
   * english_word_change_log updateMany
   */
  export type english_word_change_logUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update english_word_change_logs.
     */
    data: XOR<english_word_change_logUpdateManyMutationInput, english_word_change_logUncheckedUpdateManyInput>
    /**
     * Filter which english_word_change_logs to update
     */
    where?: english_word_change_logWhereInput
    /**
     * Limit how many english_word_change_logs to update.
     */
    limit?: number
  }

  /**
   * english_word_change_log upsert
   */
  export type english_word_change_logUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word_change_log
     */
    select?: english_word_change_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word_change_log
     */
    omit?: english_word_change_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_word_change_logInclude<ExtArgs> | null
    /**
     * The filter to search for the english_word_change_log to update in case it exists.
     */
    where: english_word_change_logWhereUniqueInput
    /**
     * In case the english_word_change_log found by the `where` argument doesn't exist, create a new english_word_change_log with this data.
     */
    create: XOR<english_word_change_logCreateInput, english_word_change_logUncheckedCreateInput>
    /**
     * In case the english_word_change_log was found with the provided `where` argument, update it with this data.
     */
    update: XOR<english_word_change_logUpdateInput, english_word_change_logUncheckedUpdateInput>
  }

  /**
   * english_word_change_log delete
   */
  export type english_word_change_logDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word_change_log
     */
    select?: english_word_change_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word_change_log
     */
    omit?: english_word_change_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_word_change_logInclude<ExtArgs> | null
    /**
     * Filter which english_word_change_log to delete.
     */
    where: english_word_change_logWhereUniqueInput
  }

  /**
   * english_word_change_log deleteMany
   */
  export type english_word_change_logDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which english_word_change_logs to delete
     */
    where?: english_word_change_logWhereInput
    /**
     * Limit how many english_word_change_logs to delete.
     */
    limit?: number
  }

  /**
   * english_word_change_log without action
   */
  export type english_word_change_logDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the english_word_change_log
     */
    select?: english_word_change_logSelect<ExtArgs> | null
    /**
     * Omit specific fields from the english_word_change_log
     */
    omit?: english_word_change_logOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: english_word_change_logInclude<ExtArgs> | null
  }


  /**
   * Model media_creator
   */

  export type AggregateMedia_creator = {
    _count: Media_creatorCountAggregateOutputType | null
    _avg: Media_creatorAvgAggregateOutputType | null
    _sum: Media_creatorSumAggregateOutputType | null
    _min: Media_creatorMinAggregateOutputType | null
    _max: Media_creatorMaxAggregateOutputType | null
  }

  export type Media_creatorAvgAggregateOutputType = {
    id: number | null
    word_id: number | null
    creator_id: number | null
  }

  export type Media_creatorSumAggregateOutputType = {
    id: bigint | null
    word_id: bigint | null
    creator_id: bigint | null
  }

  export type Media_creatorMinAggregateOutputType = {
    id: bigint | null
    word_id: bigint | null
    media_type: string | null
    media_url: string | null
    creator_id: bigint | null
    info: string | null
    created_at: Date | null
  }

  export type Media_creatorMaxAggregateOutputType = {
    id: bigint | null
    word_id: bigint | null
    media_type: string | null
    media_url: string | null
    creator_id: bigint | null
    info: string | null
    created_at: Date | null
  }

  export type Media_creatorCountAggregateOutputType = {
    id: number
    word_id: number
    media_type: number
    media_url: number
    creator_id: number
    info: number
    created_at: number
    _all: number
  }


  export type Media_creatorAvgAggregateInputType = {
    id?: true
    word_id?: true
    creator_id?: true
  }

  export type Media_creatorSumAggregateInputType = {
    id?: true
    word_id?: true
    creator_id?: true
  }

  export type Media_creatorMinAggregateInputType = {
    id?: true
    word_id?: true
    media_type?: true
    media_url?: true
    creator_id?: true
    info?: true
    created_at?: true
  }

  export type Media_creatorMaxAggregateInputType = {
    id?: true
    word_id?: true
    media_type?: true
    media_url?: true
    creator_id?: true
    info?: true
    created_at?: true
  }

  export type Media_creatorCountAggregateInputType = {
    id?: true
    word_id?: true
    media_type?: true
    media_url?: true
    creator_id?: true
    info?: true
    created_at?: true
    _all?: true
  }

  export type Media_creatorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which media_creator to aggregate.
     */
    where?: media_creatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of media_creators to fetch.
     */
    orderBy?: media_creatorOrderByWithRelationInput | media_creatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: media_creatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` media_creators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` media_creators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned media_creators
    **/
    _count?: true | Media_creatorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Media_creatorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Media_creatorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Media_creatorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Media_creatorMaxAggregateInputType
  }

  export type GetMedia_creatorAggregateType<T extends Media_creatorAggregateArgs> = {
        [P in keyof T & keyof AggregateMedia_creator]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMedia_creator[P]>
      : GetScalarType<T[P], AggregateMedia_creator[P]>
  }




  export type media_creatorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: media_creatorWhereInput
    orderBy?: media_creatorOrderByWithAggregationInput | media_creatorOrderByWithAggregationInput[]
    by: Media_creatorScalarFieldEnum[] | Media_creatorScalarFieldEnum
    having?: media_creatorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Media_creatorCountAggregateInputType | true
    _avg?: Media_creatorAvgAggregateInputType
    _sum?: Media_creatorSumAggregateInputType
    _min?: Media_creatorMinAggregateInputType
    _max?: Media_creatorMaxAggregateInputType
  }

  export type Media_creatorGroupByOutputType = {
    id: bigint
    word_id: bigint
    media_type: string
    media_url: string | null
    creator_id: bigint | null
    info: string | null
    created_at: Date | null
    _count: Media_creatorCountAggregateOutputType | null
    _avg: Media_creatorAvgAggregateOutputType | null
    _sum: Media_creatorSumAggregateOutputType | null
    _min: Media_creatorMinAggregateOutputType | null
    _max: Media_creatorMaxAggregateOutputType | null
  }

  type GetMedia_creatorGroupByPayload<T extends media_creatorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Media_creatorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Media_creatorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Media_creatorGroupByOutputType[P]>
            : GetScalarType<T[P], Media_creatorGroupByOutputType[P]>
        }
      >
    >


  export type media_creatorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    word_id?: boolean
    media_type?: boolean
    media_url?: boolean
    creator_id?: boolean
    info?: boolean
    created_at?: boolean
    english_word?: boolean | english_wordDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["media_creator"]>



  export type media_creatorSelectScalar = {
    id?: boolean
    word_id?: boolean
    media_type?: boolean
    media_url?: boolean
    creator_id?: boolean
    info?: boolean
    created_at?: boolean
  }

  export type media_creatorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "word_id" | "media_type" | "media_url" | "creator_id" | "info" | "created_at", ExtArgs["result"]["media_creator"]>
  export type media_creatorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    english_word?: boolean | english_wordDefaultArgs<ExtArgs>
  }

  export type $media_creatorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "media_creator"
    objects: {
      english_word: Prisma.$english_wordPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      word_id: bigint
      media_type: string
      media_url: string | null
      creator_id: bigint | null
      info: string | null
      created_at: Date | null
    }, ExtArgs["result"]["media_creator"]>
    composites: {}
  }

  type media_creatorGetPayload<S extends boolean | null | undefined | media_creatorDefaultArgs> = $Result.GetResult<Prisma.$media_creatorPayload, S>

  type media_creatorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<media_creatorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Media_creatorCountAggregateInputType | true
    }

  export interface media_creatorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['media_creator'], meta: { name: 'media_creator' } }
    /**
     * Find zero or one Media_creator that matches the filter.
     * @param {media_creatorFindUniqueArgs} args - Arguments to find a Media_creator
     * @example
     * // Get one Media_creator
     * const media_creator = await prisma.media_creator.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends media_creatorFindUniqueArgs>(args: SelectSubset<T, media_creatorFindUniqueArgs<ExtArgs>>): Prisma__media_creatorClient<$Result.GetResult<Prisma.$media_creatorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Media_creator that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {media_creatorFindUniqueOrThrowArgs} args - Arguments to find a Media_creator
     * @example
     * // Get one Media_creator
     * const media_creator = await prisma.media_creator.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends media_creatorFindUniqueOrThrowArgs>(args: SelectSubset<T, media_creatorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__media_creatorClient<$Result.GetResult<Prisma.$media_creatorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Media_creator that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {media_creatorFindFirstArgs} args - Arguments to find a Media_creator
     * @example
     * // Get one Media_creator
     * const media_creator = await prisma.media_creator.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends media_creatorFindFirstArgs>(args?: SelectSubset<T, media_creatorFindFirstArgs<ExtArgs>>): Prisma__media_creatorClient<$Result.GetResult<Prisma.$media_creatorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Media_creator that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {media_creatorFindFirstOrThrowArgs} args - Arguments to find a Media_creator
     * @example
     * // Get one Media_creator
     * const media_creator = await prisma.media_creator.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends media_creatorFindFirstOrThrowArgs>(args?: SelectSubset<T, media_creatorFindFirstOrThrowArgs<ExtArgs>>): Prisma__media_creatorClient<$Result.GetResult<Prisma.$media_creatorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Media_creators that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {media_creatorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Media_creators
     * const media_creators = await prisma.media_creator.findMany()
     * 
     * // Get first 10 Media_creators
     * const media_creators = await prisma.media_creator.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const media_creatorWithIdOnly = await prisma.media_creator.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends media_creatorFindManyArgs>(args?: SelectSubset<T, media_creatorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$media_creatorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Media_creator.
     * @param {media_creatorCreateArgs} args - Arguments to create a Media_creator.
     * @example
     * // Create one Media_creator
     * const Media_creator = await prisma.media_creator.create({
     *   data: {
     *     // ... data to create a Media_creator
     *   }
     * })
     * 
     */
    create<T extends media_creatorCreateArgs>(args: SelectSubset<T, media_creatorCreateArgs<ExtArgs>>): Prisma__media_creatorClient<$Result.GetResult<Prisma.$media_creatorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Media_creators.
     * @param {media_creatorCreateManyArgs} args - Arguments to create many Media_creators.
     * @example
     * // Create many Media_creators
     * const media_creator = await prisma.media_creator.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends media_creatorCreateManyArgs>(args?: SelectSubset<T, media_creatorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Media_creator.
     * @param {media_creatorDeleteArgs} args - Arguments to delete one Media_creator.
     * @example
     * // Delete one Media_creator
     * const Media_creator = await prisma.media_creator.delete({
     *   where: {
     *     // ... filter to delete one Media_creator
     *   }
     * })
     * 
     */
    delete<T extends media_creatorDeleteArgs>(args: SelectSubset<T, media_creatorDeleteArgs<ExtArgs>>): Prisma__media_creatorClient<$Result.GetResult<Prisma.$media_creatorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Media_creator.
     * @param {media_creatorUpdateArgs} args - Arguments to update one Media_creator.
     * @example
     * // Update one Media_creator
     * const media_creator = await prisma.media_creator.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends media_creatorUpdateArgs>(args: SelectSubset<T, media_creatorUpdateArgs<ExtArgs>>): Prisma__media_creatorClient<$Result.GetResult<Prisma.$media_creatorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Media_creators.
     * @param {media_creatorDeleteManyArgs} args - Arguments to filter Media_creators to delete.
     * @example
     * // Delete a few Media_creators
     * const { count } = await prisma.media_creator.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends media_creatorDeleteManyArgs>(args?: SelectSubset<T, media_creatorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Media_creators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {media_creatorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Media_creators
     * const media_creator = await prisma.media_creator.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends media_creatorUpdateManyArgs>(args: SelectSubset<T, media_creatorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Media_creator.
     * @param {media_creatorUpsertArgs} args - Arguments to update or create a Media_creator.
     * @example
     * // Update or create a Media_creator
     * const media_creator = await prisma.media_creator.upsert({
     *   create: {
     *     // ... data to create a Media_creator
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Media_creator we want to update
     *   }
     * })
     */
    upsert<T extends media_creatorUpsertArgs>(args: SelectSubset<T, media_creatorUpsertArgs<ExtArgs>>): Prisma__media_creatorClient<$Result.GetResult<Prisma.$media_creatorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Media_creators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {media_creatorCountArgs} args - Arguments to filter Media_creators to count.
     * @example
     * // Count the number of Media_creators
     * const count = await prisma.media_creator.count({
     *   where: {
     *     // ... the filter for the Media_creators we want to count
     *   }
     * })
    **/
    count<T extends media_creatorCountArgs>(
      args?: Subset<T, media_creatorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Media_creatorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Media_creator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Media_creatorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Media_creatorAggregateArgs>(args: Subset<T, Media_creatorAggregateArgs>): Prisma.PrismaPromise<GetMedia_creatorAggregateType<T>>

    /**
     * Group by Media_creator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {media_creatorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends media_creatorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: media_creatorGroupByArgs['orderBy'] }
        : { orderBy?: media_creatorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, media_creatorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMedia_creatorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the media_creator model
   */
  readonly fields: media_creatorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for media_creator.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__media_creatorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    english_word<T extends english_wordDefaultArgs<ExtArgs> = {}>(args?: Subset<T, english_wordDefaultArgs<ExtArgs>>): Prisma__english_wordClient<$Result.GetResult<Prisma.$english_wordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the media_creator model
   */
  interface media_creatorFieldRefs {
    readonly id: FieldRef<"media_creator", 'BigInt'>
    readonly word_id: FieldRef<"media_creator", 'BigInt'>
    readonly media_type: FieldRef<"media_creator", 'String'>
    readonly media_url: FieldRef<"media_creator", 'String'>
    readonly creator_id: FieldRef<"media_creator", 'BigInt'>
    readonly info: FieldRef<"media_creator", 'String'>
    readonly created_at: FieldRef<"media_creator", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * media_creator findUnique
   */
  export type media_creatorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the media_creator
     */
    select?: media_creatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the media_creator
     */
    omit?: media_creatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: media_creatorInclude<ExtArgs> | null
    /**
     * Filter, which media_creator to fetch.
     */
    where: media_creatorWhereUniqueInput
  }

  /**
   * media_creator findUniqueOrThrow
   */
  export type media_creatorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the media_creator
     */
    select?: media_creatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the media_creator
     */
    omit?: media_creatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: media_creatorInclude<ExtArgs> | null
    /**
     * Filter, which media_creator to fetch.
     */
    where: media_creatorWhereUniqueInput
  }

  /**
   * media_creator findFirst
   */
  export type media_creatorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the media_creator
     */
    select?: media_creatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the media_creator
     */
    omit?: media_creatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: media_creatorInclude<ExtArgs> | null
    /**
     * Filter, which media_creator to fetch.
     */
    where?: media_creatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of media_creators to fetch.
     */
    orderBy?: media_creatorOrderByWithRelationInput | media_creatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for media_creators.
     */
    cursor?: media_creatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` media_creators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` media_creators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of media_creators.
     */
    distinct?: Media_creatorScalarFieldEnum | Media_creatorScalarFieldEnum[]
  }

  /**
   * media_creator findFirstOrThrow
   */
  export type media_creatorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the media_creator
     */
    select?: media_creatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the media_creator
     */
    omit?: media_creatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: media_creatorInclude<ExtArgs> | null
    /**
     * Filter, which media_creator to fetch.
     */
    where?: media_creatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of media_creators to fetch.
     */
    orderBy?: media_creatorOrderByWithRelationInput | media_creatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for media_creators.
     */
    cursor?: media_creatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` media_creators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` media_creators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of media_creators.
     */
    distinct?: Media_creatorScalarFieldEnum | Media_creatorScalarFieldEnum[]
  }

  /**
   * media_creator findMany
   */
  export type media_creatorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the media_creator
     */
    select?: media_creatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the media_creator
     */
    omit?: media_creatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: media_creatorInclude<ExtArgs> | null
    /**
     * Filter, which media_creators to fetch.
     */
    where?: media_creatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of media_creators to fetch.
     */
    orderBy?: media_creatorOrderByWithRelationInput | media_creatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing media_creators.
     */
    cursor?: media_creatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` media_creators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` media_creators.
     */
    skip?: number
    distinct?: Media_creatorScalarFieldEnum | Media_creatorScalarFieldEnum[]
  }

  /**
   * media_creator create
   */
  export type media_creatorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the media_creator
     */
    select?: media_creatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the media_creator
     */
    omit?: media_creatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: media_creatorInclude<ExtArgs> | null
    /**
     * The data needed to create a media_creator.
     */
    data: XOR<media_creatorCreateInput, media_creatorUncheckedCreateInput>
  }

  /**
   * media_creator createMany
   */
  export type media_creatorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many media_creators.
     */
    data: media_creatorCreateManyInput | media_creatorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * media_creator update
   */
  export type media_creatorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the media_creator
     */
    select?: media_creatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the media_creator
     */
    omit?: media_creatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: media_creatorInclude<ExtArgs> | null
    /**
     * The data needed to update a media_creator.
     */
    data: XOR<media_creatorUpdateInput, media_creatorUncheckedUpdateInput>
    /**
     * Choose, which media_creator to update.
     */
    where: media_creatorWhereUniqueInput
  }

  /**
   * media_creator updateMany
   */
  export type media_creatorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update media_creators.
     */
    data: XOR<media_creatorUpdateManyMutationInput, media_creatorUncheckedUpdateManyInput>
    /**
     * Filter which media_creators to update
     */
    where?: media_creatorWhereInput
    /**
     * Limit how many media_creators to update.
     */
    limit?: number
  }

  /**
   * media_creator upsert
   */
  export type media_creatorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the media_creator
     */
    select?: media_creatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the media_creator
     */
    omit?: media_creatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: media_creatorInclude<ExtArgs> | null
    /**
     * The filter to search for the media_creator to update in case it exists.
     */
    where: media_creatorWhereUniqueInput
    /**
     * In case the media_creator found by the `where` argument doesn't exist, create a new media_creator with this data.
     */
    create: XOR<media_creatorCreateInput, media_creatorUncheckedCreateInput>
    /**
     * In case the media_creator was found with the provided `where` argument, update it with this data.
     */
    update: XOR<media_creatorUpdateInput, media_creatorUncheckedUpdateInput>
  }

  /**
   * media_creator delete
   */
  export type media_creatorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the media_creator
     */
    select?: media_creatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the media_creator
     */
    omit?: media_creatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: media_creatorInclude<ExtArgs> | null
    /**
     * Filter which media_creator to delete.
     */
    where: media_creatorWhereUniqueInput
  }

  /**
   * media_creator deleteMany
   */
  export type media_creatorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which media_creators to delete
     */
    where?: media_creatorWhereInput
    /**
     * Limit how many media_creators to delete.
     */
    limit?: number
  }

  /**
   * media_creator without action
   */
  export type media_creatorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the media_creator
     */
    select?: media_creatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the media_creator
     */
    omit?: media_creatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: media_creatorInclude<ExtArgs> | null
  }


  /**
   * Model post
   */

  export type AggregatePost = {
    _count: PostCountAggregateOutputType | null
    _avg: PostAvgAggregateOutputType | null
    _sum: PostSumAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  export type PostAvgAggregateOutputType = {
    id: number | null
    thumbNum: number | null
    favourNum: number | null
    userId: number | null
    isDelete: number | null
  }

  export type PostSumAggregateOutputType = {
    id: bigint | null
    thumbNum: number | null
    favourNum: number | null
    userId: bigint | null
    isDelete: number | null
  }

  export type PostMinAggregateOutputType = {
    id: bigint | null
    title: string | null
    content: string | null
    tags: string | null
    thumbNum: number | null
    favourNum: number | null
    userId: bigint | null
    createTime: Date | null
    updateTime: Date | null
    isDelete: number | null
  }

  export type PostMaxAggregateOutputType = {
    id: bigint | null
    title: string | null
    content: string | null
    tags: string | null
    thumbNum: number | null
    favourNum: number | null
    userId: bigint | null
    createTime: Date | null
    updateTime: Date | null
    isDelete: number | null
  }

  export type PostCountAggregateOutputType = {
    id: number
    title: number
    content: number
    tags: number
    thumbNum: number
    favourNum: number
    userId: number
    createTime: number
    updateTime: number
    isDelete: number
    _all: number
  }


  export type PostAvgAggregateInputType = {
    id?: true
    thumbNum?: true
    favourNum?: true
    userId?: true
    isDelete?: true
  }

  export type PostSumAggregateInputType = {
    id?: true
    thumbNum?: true
    favourNum?: true
    userId?: true
    isDelete?: true
  }

  export type PostMinAggregateInputType = {
    id?: true
    title?: true
    content?: true
    tags?: true
    thumbNum?: true
    favourNum?: true
    userId?: true
    createTime?: true
    updateTime?: true
    isDelete?: true
  }

  export type PostMaxAggregateInputType = {
    id?: true
    title?: true
    content?: true
    tags?: true
    thumbNum?: true
    favourNum?: true
    userId?: true
    createTime?: true
    updateTime?: true
    isDelete?: true
  }

  export type PostCountAggregateInputType = {
    id?: true
    title?: true
    content?: true
    tags?: true
    thumbNum?: true
    favourNum?: true
    userId?: true
    createTime?: true
    updateTime?: true
    isDelete?: true
    _all?: true
  }

  export type PostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which post to aggregate.
     */
    where?: postWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of posts to fetch.
     */
    orderBy?: postOrderByWithRelationInput | postOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: postWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned posts
    **/
    _count?: true | PostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PostAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PostSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PostMaxAggregateInputType
  }

  export type GetPostAggregateType<T extends PostAggregateArgs> = {
        [P in keyof T & keyof AggregatePost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePost[P]>
      : GetScalarType<T[P], AggregatePost[P]>
  }




  export type postGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: postWhereInput
    orderBy?: postOrderByWithAggregationInput | postOrderByWithAggregationInput[]
    by: PostScalarFieldEnum[] | PostScalarFieldEnum
    having?: postScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PostCountAggregateInputType | true
    _avg?: PostAvgAggregateInputType
    _sum?: PostSumAggregateInputType
    _min?: PostMinAggregateInputType
    _max?: PostMaxAggregateInputType
  }

  export type PostGroupByOutputType = {
    id: bigint
    title: string | null
    content: string | null
    tags: string | null
    thumbNum: number
    favourNum: number
    userId: bigint
    createTime: Date
    updateTime: Date
    isDelete: number
    _count: PostCountAggregateOutputType | null
    _avg: PostAvgAggregateOutputType | null
    _sum: PostSumAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  type GetPostGroupByPayload<T extends postGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PostGroupByOutputType[P]>
            : GetScalarType<T[P], PostGroupByOutputType[P]>
        }
      >
    >


  export type postSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    tags?: boolean
    thumbNum?: boolean
    favourNum?: boolean
    userId?: boolean
    createTime?: boolean
    updateTime?: boolean
    isDelete?: boolean
  }, ExtArgs["result"]["post"]>



  export type postSelectScalar = {
    id?: boolean
    title?: boolean
    content?: boolean
    tags?: boolean
    thumbNum?: boolean
    favourNum?: boolean
    userId?: boolean
    createTime?: boolean
    updateTime?: boolean
    isDelete?: boolean
  }

  export type postOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "content" | "tags" | "thumbNum" | "favourNum" | "userId" | "createTime" | "updateTime" | "isDelete", ExtArgs["result"]["post"]>

  export type $postPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "post"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      title: string | null
      content: string | null
      tags: string | null
      thumbNum: number
      favourNum: number
      userId: bigint
      createTime: Date
      updateTime: Date
      isDelete: number
    }, ExtArgs["result"]["post"]>
    composites: {}
  }

  type postGetPayload<S extends boolean | null | undefined | postDefaultArgs> = $Result.GetResult<Prisma.$postPayload, S>

  type postCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<postFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PostCountAggregateInputType | true
    }

  export interface postDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['post'], meta: { name: 'post' } }
    /**
     * Find zero or one Post that matches the filter.
     * @param {postFindUniqueArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends postFindUniqueArgs>(args: SelectSubset<T, postFindUniqueArgs<ExtArgs>>): Prisma__postClient<$Result.GetResult<Prisma.$postPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Post that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {postFindUniqueOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends postFindUniqueOrThrowArgs>(args: SelectSubset<T, postFindUniqueOrThrowArgs<ExtArgs>>): Prisma__postClient<$Result.GetResult<Prisma.$postPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {postFindFirstArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends postFindFirstArgs>(args?: SelectSubset<T, postFindFirstArgs<ExtArgs>>): Prisma__postClient<$Result.GetResult<Prisma.$postPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {postFindFirstOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends postFindFirstOrThrowArgs>(args?: SelectSubset<T, postFindFirstOrThrowArgs<ExtArgs>>): Prisma__postClient<$Result.GetResult<Prisma.$postPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Posts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {postFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Posts
     * const posts = await prisma.post.findMany()
     * 
     * // Get first 10 Posts
     * const posts = await prisma.post.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const postWithIdOnly = await prisma.post.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends postFindManyArgs>(args?: SelectSubset<T, postFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$postPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Post.
     * @param {postCreateArgs} args - Arguments to create a Post.
     * @example
     * // Create one Post
     * const Post = await prisma.post.create({
     *   data: {
     *     // ... data to create a Post
     *   }
     * })
     * 
     */
    create<T extends postCreateArgs>(args: SelectSubset<T, postCreateArgs<ExtArgs>>): Prisma__postClient<$Result.GetResult<Prisma.$postPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Posts.
     * @param {postCreateManyArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends postCreateManyArgs>(args?: SelectSubset<T, postCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Post.
     * @param {postDeleteArgs} args - Arguments to delete one Post.
     * @example
     * // Delete one Post
     * const Post = await prisma.post.delete({
     *   where: {
     *     // ... filter to delete one Post
     *   }
     * })
     * 
     */
    delete<T extends postDeleteArgs>(args: SelectSubset<T, postDeleteArgs<ExtArgs>>): Prisma__postClient<$Result.GetResult<Prisma.$postPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Post.
     * @param {postUpdateArgs} args - Arguments to update one Post.
     * @example
     * // Update one Post
     * const post = await prisma.post.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends postUpdateArgs>(args: SelectSubset<T, postUpdateArgs<ExtArgs>>): Prisma__postClient<$Result.GetResult<Prisma.$postPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Posts.
     * @param {postDeleteManyArgs} args - Arguments to filter Posts to delete.
     * @example
     * // Delete a few Posts
     * const { count } = await prisma.post.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends postDeleteManyArgs>(args?: SelectSubset<T, postDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {postUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends postUpdateManyArgs>(args: SelectSubset<T, postUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Post.
     * @param {postUpsertArgs} args - Arguments to update or create a Post.
     * @example
     * // Update or create a Post
     * const post = await prisma.post.upsert({
     *   create: {
     *     // ... data to create a Post
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Post we want to update
     *   }
     * })
     */
    upsert<T extends postUpsertArgs>(args: SelectSubset<T, postUpsertArgs<ExtArgs>>): Prisma__postClient<$Result.GetResult<Prisma.$postPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {postCountArgs} args - Arguments to filter Posts to count.
     * @example
     * // Count the number of Posts
     * const count = await prisma.post.count({
     *   where: {
     *     // ... the filter for the Posts we want to count
     *   }
     * })
    **/
    count<T extends postCountArgs>(
      args?: Subset<T, postCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PostAggregateArgs>(args: Subset<T, PostAggregateArgs>): Prisma.PrismaPromise<GetPostAggregateType<T>>

    /**
     * Group by Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {postGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends postGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: postGroupByArgs['orderBy'] }
        : { orderBy?: postGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, postGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the post model
   */
  readonly fields: postFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for post.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__postClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the post model
   */
  interface postFieldRefs {
    readonly id: FieldRef<"post", 'BigInt'>
    readonly title: FieldRef<"post", 'String'>
    readonly content: FieldRef<"post", 'String'>
    readonly tags: FieldRef<"post", 'String'>
    readonly thumbNum: FieldRef<"post", 'Int'>
    readonly favourNum: FieldRef<"post", 'Int'>
    readonly userId: FieldRef<"post", 'BigInt'>
    readonly createTime: FieldRef<"post", 'DateTime'>
    readonly updateTime: FieldRef<"post", 'DateTime'>
    readonly isDelete: FieldRef<"post", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * post findUnique
   */
  export type postFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post
     */
    select?: postSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post
     */
    omit?: postOmit<ExtArgs> | null
    /**
     * Filter, which post to fetch.
     */
    where: postWhereUniqueInput
  }

  /**
   * post findUniqueOrThrow
   */
  export type postFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post
     */
    select?: postSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post
     */
    omit?: postOmit<ExtArgs> | null
    /**
     * Filter, which post to fetch.
     */
    where: postWhereUniqueInput
  }

  /**
   * post findFirst
   */
  export type postFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post
     */
    select?: postSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post
     */
    omit?: postOmit<ExtArgs> | null
    /**
     * Filter, which post to fetch.
     */
    where?: postWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of posts to fetch.
     */
    orderBy?: postOrderByWithRelationInput | postOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for posts.
     */
    cursor?: postWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * post findFirstOrThrow
   */
  export type postFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post
     */
    select?: postSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post
     */
    omit?: postOmit<ExtArgs> | null
    /**
     * Filter, which post to fetch.
     */
    where?: postWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of posts to fetch.
     */
    orderBy?: postOrderByWithRelationInput | postOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for posts.
     */
    cursor?: postWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * post findMany
   */
  export type postFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post
     */
    select?: postSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post
     */
    omit?: postOmit<ExtArgs> | null
    /**
     * Filter, which posts to fetch.
     */
    where?: postWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of posts to fetch.
     */
    orderBy?: postOrderByWithRelationInput | postOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing posts.
     */
    cursor?: postWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` posts.
     */
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * post create
   */
  export type postCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post
     */
    select?: postSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post
     */
    omit?: postOmit<ExtArgs> | null
    /**
     * The data needed to create a post.
     */
    data: XOR<postCreateInput, postUncheckedCreateInput>
  }

  /**
   * post createMany
   */
  export type postCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many posts.
     */
    data: postCreateManyInput | postCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * post update
   */
  export type postUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post
     */
    select?: postSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post
     */
    omit?: postOmit<ExtArgs> | null
    /**
     * The data needed to update a post.
     */
    data: XOR<postUpdateInput, postUncheckedUpdateInput>
    /**
     * Choose, which post to update.
     */
    where: postWhereUniqueInput
  }

  /**
   * post updateMany
   */
  export type postUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update posts.
     */
    data: XOR<postUpdateManyMutationInput, postUncheckedUpdateManyInput>
    /**
     * Filter which posts to update
     */
    where?: postWhereInput
    /**
     * Limit how many posts to update.
     */
    limit?: number
  }

  /**
   * post upsert
   */
  export type postUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post
     */
    select?: postSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post
     */
    omit?: postOmit<ExtArgs> | null
    /**
     * The filter to search for the post to update in case it exists.
     */
    where: postWhereUniqueInput
    /**
     * In case the post found by the `where` argument doesn't exist, create a new post with this data.
     */
    create: XOR<postCreateInput, postUncheckedCreateInput>
    /**
     * In case the post was found with the provided `where` argument, update it with this data.
     */
    update: XOR<postUpdateInput, postUncheckedUpdateInput>
  }

  /**
   * post delete
   */
  export type postDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post
     */
    select?: postSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post
     */
    omit?: postOmit<ExtArgs> | null
    /**
     * Filter which post to delete.
     */
    where: postWhereUniqueInput
  }

  /**
   * post deleteMany
   */
  export type postDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which posts to delete
     */
    where?: postWhereInput
    /**
     * Limit how many posts to delete.
     */
    limit?: number
  }

  /**
   * post without action
   */
  export type postDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post
     */
    select?: postSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post
     */
    omit?: postOmit<ExtArgs> | null
  }


  /**
   * Model post_favour
   */

  export type AggregatePost_favour = {
    _count: Post_favourCountAggregateOutputType | null
    _avg: Post_favourAvgAggregateOutputType | null
    _sum: Post_favourSumAggregateOutputType | null
    _min: Post_favourMinAggregateOutputType | null
    _max: Post_favourMaxAggregateOutputType | null
  }

  export type Post_favourAvgAggregateOutputType = {
    id: number | null
    postId: number | null
    userId: number | null
  }

  export type Post_favourSumAggregateOutputType = {
    id: bigint | null
    postId: bigint | null
    userId: bigint | null
  }

  export type Post_favourMinAggregateOutputType = {
    id: bigint | null
    postId: bigint | null
    userId: bigint | null
    createTime: Date | null
    updateTime: Date | null
  }

  export type Post_favourMaxAggregateOutputType = {
    id: bigint | null
    postId: bigint | null
    userId: bigint | null
    createTime: Date | null
    updateTime: Date | null
  }

  export type Post_favourCountAggregateOutputType = {
    id: number
    postId: number
    userId: number
    createTime: number
    updateTime: number
    _all: number
  }


  export type Post_favourAvgAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
  }

  export type Post_favourSumAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
  }

  export type Post_favourMinAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    createTime?: true
    updateTime?: true
  }

  export type Post_favourMaxAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    createTime?: true
    updateTime?: true
  }

  export type Post_favourCountAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    createTime?: true
    updateTime?: true
    _all?: true
  }

  export type Post_favourAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which post_favour to aggregate.
     */
    where?: post_favourWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of post_favours to fetch.
     */
    orderBy?: post_favourOrderByWithRelationInput | post_favourOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: post_favourWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` post_favours from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` post_favours.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned post_favours
    **/
    _count?: true | Post_favourCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Post_favourAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Post_favourSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Post_favourMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Post_favourMaxAggregateInputType
  }

  export type GetPost_favourAggregateType<T extends Post_favourAggregateArgs> = {
        [P in keyof T & keyof AggregatePost_favour]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePost_favour[P]>
      : GetScalarType<T[P], AggregatePost_favour[P]>
  }




  export type post_favourGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: post_favourWhereInput
    orderBy?: post_favourOrderByWithAggregationInput | post_favourOrderByWithAggregationInput[]
    by: Post_favourScalarFieldEnum[] | Post_favourScalarFieldEnum
    having?: post_favourScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Post_favourCountAggregateInputType | true
    _avg?: Post_favourAvgAggregateInputType
    _sum?: Post_favourSumAggregateInputType
    _min?: Post_favourMinAggregateInputType
    _max?: Post_favourMaxAggregateInputType
  }

  export type Post_favourGroupByOutputType = {
    id: bigint
    postId: bigint
    userId: bigint
    createTime: Date
    updateTime: Date
    _count: Post_favourCountAggregateOutputType | null
    _avg: Post_favourAvgAggregateOutputType | null
    _sum: Post_favourSumAggregateOutputType | null
    _min: Post_favourMinAggregateOutputType | null
    _max: Post_favourMaxAggregateOutputType | null
  }

  type GetPost_favourGroupByPayload<T extends post_favourGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Post_favourGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Post_favourGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Post_favourGroupByOutputType[P]>
            : GetScalarType<T[P], Post_favourGroupByOutputType[P]>
        }
      >
    >


  export type post_favourSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    postId?: boolean
    userId?: boolean
    createTime?: boolean
    updateTime?: boolean
  }, ExtArgs["result"]["post_favour"]>



  export type post_favourSelectScalar = {
    id?: boolean
    postId?: boolean
    userId?: boolean
    createTime?: boolean
    updateTime?: boolean
  }

  export type post_favourOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "postId" | "userId" | "createTime" | "updateTime", ExtArgs["result"]["post_favour"]>

  export type $post_favourPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "post_favour"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      postId: bigint
      userId: bigint
      createTime: Date
      updateTime: Date
    }, ExtArgs["result"]["post_favour"]>
    composites: {}
  }

  type post_favourGetPayload<S extends boolean | null | undefined | post_favourDefaultArgs> = $Result.GetResult<Prisma.$post_favourPayload, S>

  type post_favourCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<post_favourFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Post_favourCountAggregateInputType | true
    }

  export interface post_favourDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['post_favour'], meta: { name: 'post_favour' } }
    /**
     * Find zero or one Post_favour that matches the filter.
     * @param {post_favourFindUniqueArgs} args - Arguments to find a Post_favour
     * @example
     * // Get one Post_favour
     * const post_favour = await prisma.post_favour.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends post_favourFindUniqueArgs>(args: SelectSubset<T, post_favourFindUniqueArgs<ExtArgs>>): Prisma__post_favourClient<$Result.GetResult<Prisma.$post_favourPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Post_favour that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {post_favourFindUniqueOrThrowArgs} args - Arguments to find a Post_favour
     * @example
     * // Get one Post_favour
     * const post_favour = await prisma.post_favour.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends post_favourFindUniqueOrThrowArgs>(args: SelectSubset<T, post_favourFindUniqueOrThrowArgs<ExtArgs>>): Prisma__post_favourClient<$Result.GetResult<Prisma.$post_favourPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post_favour that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {post_favourFindFirstArgs} args - Arguments to find a Post_favour
     * @example
     * // Get one Post_favour
     * const post_favour = await prisma.post_favour.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends post_favourFindFirstArgs>(args?: SelectSubset<T, post_favourFindFirstArgs<ExtArgs>>): Prisma__post_favourClient<$Result.GetResult<Prisma.$post_favourPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post_favour that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {post_favourFindFirstOrThrowArgs} args - Arguments to find a Post_favour
     * @example
     * // Get one Post_favour
     * const post_favour = await prisma.post_favour.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends post_favourFindFirstOrThrowArgs>(args?: SelectSubset<T, post_favourFindFirstOrThrowArgs<ExtArgs>>): Prisma__post_favourClient<$Result.GetResult<Prisma.$post_favourPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Post_favours that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {post_favourFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Post_favours
     * const post_favours = await prisma.post_favour.findMany()
     * 
     * // Get first 10 Post_favours
     * const post_favours = await prisma.post_favour.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const post_favourWithIdOnly = await prisma.post_favour.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends post_favourFindManyArgs>(args?: SelectSubset<T, post_favourFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$post_favourPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Post_favour.
     * @param {post_favourCreateArgs} args - Arguments to create a Post_favour.
     * @example
     * // Create one Post_favour
     * const Post_favour = await prisma.post_favour.create({
     *   data: {
     *     // ... data to create a Post_favour
     *   }
     * })
     * 
     */
    create<T extends post_favourCreateArgs>(args: SelectSubset<T, post_favourCreateArgs<ExtArgs>>): Prisma__post_favourClient<$Result.GetResult<Prisma.$post_favourPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Post_favours.
     * @param {post_favourCreateManyArgs} args - Arguments to create many Post_favours.
     * @example
     * // Create many Post_favours
     * const post_favour = await prisma.post_favour.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends post_favourCreateManyArgs>(args?: SelectSubset<T, post_favourCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Post_favour.
     * @param {post_favourDeleteArgs} args - Arguments to delete one Post_favour.
     * @example
     * // Delete one Post_favour
     * const Post_favour = await prisma.post_favour.delete({
     *   where: {
     *     // ... filter to delete one Post_favour
     *   }
     * })
     * 
     */
    delete<T extends post_favourDeleteArgs>(args: SelectSubset<T, post_favourDeleteArgs<ExtArgs>>): Prisma__post_favourClient<$Result.GetResult<Prisma.$post_favourPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Post_favour.
     * @param {post_favourUpdateArgs} args - Arguments to update one Post_favour.
     * @example
     * // Update one Post_favour
     * const post_favour = await prisma.post_favour.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends post_favourUpdateArgs>(args: SelectSubset<T, post_favourUpdateArgs<ExtArgs>>): Prisma__post_favourClient<$Result.GetResult<Prisma.$post_favourPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Post_favours.
     * @param {post_favourDeleteManyArgs} args - Arguments to filter Post_favours to delete.
     * @example
     * // Delete a few Post_favours
     * const { count } = await prisma.post_favour.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends post_favourDeleteManyArgs>(args?: SelectSubset<T, post_favourDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Post_favours.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {post_favourUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Post_favours
     * const post_favour = await prisma.post_favour.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends post_favourUpdateManyArgs>(args: SelectSubset<T, post_favourUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Post_favour.
     * @param {post_favourUpsertArgs} args - Arguments to update or create a Post_favour.
     * @example
     * // Update or create a Post_favour
     * const post_favour = await prisma.post_favour.upsert({
     *   create: {
     *     // ... data to create a Post_favour
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Post_favour we want to update
     *   }
     * })
     */
    upsert<T extends post_favourUpsertArgs>(args: SelectSubset<T, post_favourUpsertArgs<ExtArgs>>): Prisma__post_favourClient<$Result.GetResult<Prisma.$post_favourPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Post_favours.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {post_favourCountArgs} args - Arguments to filter Post_favours to count.
     * @example
     * // Count the number of Post_favours
     * const count = await prisma.post_favour.count({
     *   where: {
     *     // ... the filter for the Post_favours we want to count
     *   }
     * })
    **/
    count<T extends post_favourCountArgs>(
      args?: Subset<T, post_favourCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Post_favourCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Post_favour.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Post_favourAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Post_favourAggregateArgs>(args: Subset<T, Post_favourAggregateArgs>): Prisma.PrismaPromise<GetPost_favourAggregateType<T>>

    /**
     * Group by Post_favour.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {post_favourGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends post_favourGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: post_favourGroupByArgs['orderBy'] }
        : { orderBy?: post_favourGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, post_favourGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPost_favourGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the post_favour model
   */
  readonly fields: post_favourFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for post_favour.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__post_favourClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the post_favour model
   */
  interface post_favourFieldRefs {
    readonly id: FieldRef<"post_favour", 'BigInt'>
    readonly postId: FieldRef<"post_favour", 'BigInt'>
    readonly userId: FieldRef<"post_favour", 'BigInt'>
    readonly createTime: FieldRef<"post_favour", 'DateTime'>
    readonly updateTime: FieldRef<"post_favour", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * post_favour findUnique
   */
  export type post_favourFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post_favour
     */
    select?: post_favourSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post_favour
     */
    omit?: post_favourOmit<ExtArgs> | null
    /**
     * Filter, which post_favour to fetch.
     */
    where: post_favourWhereUniqueInput
  }

  /**
   * post_favour findUniqueOrThrow
   */
  export type post_favourFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post_favour
     */
    select?: post_favourSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post_favour
     */
    omit?: post_favourOmit<ExtArgs> | null
    /**
     * Filter, which post_favour to fetch.
     */
    where: post_favourWhereUniqueInput
  }

  /**
   * post_favour findFirst
   */
  export type post_favourFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post_favour
     */
    select?: post_favourSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post_favour
     */
    omit?: post_favourOmit<ExtArgs> | null
    /**
     * Filter, which post_favour to fetch.
     */
    where?: post_favourWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of post_favours to fetch.
     */
    orderBy?: post_favourOrderByWithRelationInput | post_favourOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for post_favours.
     */
    cursor?: post_favourWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` post_favours from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` post_favours.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of post_favours.
     */
    distinct?: Post_favourScalarFieldEnum | Post_favourScalarFieldEnum[]
  }

  /**
   * post_favour findFirstOrThrow
   */
  export type post_favourFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post_favour
     */
    select?: post_favourSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post_favour
     */
    omit?: post_favourOmit<ExtArgs> | null
    /**
     * Filter, which post_favour to fetch.
     */
    where?: post_favourWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of post_favours to fetch.
     */
    orderBy?: post_favourOrderByWithRelationInput | post_favourOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for post_favours.
     */
    cursor?: post_favourWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` post_favours from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` post_favours.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of post_favours.
     */
    distinct?: Post_favourScalarFieldEnum | Post_favourScalarFieldEnum[]
  }

  /**
   * post_favour findMany
   */
  export type post_favourFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post_favour
     */
    select?: post_favourSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post_favour
     */
    omit?: post_favourOmit<ExtArgs> | null
    /**
     * Filter, which post_favours to fetch.
     */
    where?: post_favourWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of post_favours to fetch.
     */
    orderBy?: post_favourOrderByWithRelationInput | post_favourOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing post_favours.
     */
    cursor?: post_favourWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` post_favours from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` post_favours.
     */
    skip?: number
    distinct?: Post_favourScalarFieldEnum | Post_favourScalarFieldEnum[]
  }

  /**
   * post_favour create
   */
  export type post_favourCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post_favour
     */
    select?: post_favourSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post_favour
     */
    omit?: post_favourOmit<ExtArgs> | null
    /**
     * The data needed to create a post_favour.
     */
    data: XOR<post_favourCreateInput, post_favourUncheckedCreateInput>
  }

  /**
   * post_favour createMany
   */
  export type post_favourCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many post_favours.
     */
    data: post_favourCreateManyInput | post_favourCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * post_favour update
   */
  export type post_favourUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post_favour
     */
    select?: post_favourSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post_favour
     */
    omit?: post_favourOmit<ExtArgs> | null
    /**
     * The data needed to update a post_favour.
     */
    data: XOR<post_favourUpdateInput, post_favourUncheckedUpdateInput>
    /**
     * Choose, which post_favour to update.
     */
    where: post_favourWhereUniqueInput
  }

  /**
   * post_favour updateMany
   */
  export type post_favourUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update post_favours.
     */
    data: XOR<post_favourUpdateManyMutationInput, post_favourUncheckedUpdateManyInput>
    /**
     * Filter which post_favours to update
     */
    where?: post_favourWhereInput
    /**
     * Limit how many post_favours to update.
     */
    limit?: number
  }

  /**
   * post_favour upsert
   */
  export type post_favourUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post_favour
     */
    select?: post_favourSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post_favour
     */
    omit?: post_favourOmit<ExtArgs> | null
    /**
     * The filter to search for the post_favour to update in case it exists.
     */
    where: post_favourWhereUniqueInput
    /**
     * In case the post_favour found by the `where` argument doesn't exist, create a new post_favour with this data.
     */
    create: XOR<post_favourCreateInput, post_favourUncheckedCreateInput>
    /**
     * In case the post_favour was found with the provided `where` argument, update it with this data.
     */
    update: XOR<post_favourUpdateInput, post_favourUncheckedUpdateInput>
  }

  /**
   * post_favour delete
   */
  export type post_favourDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post_favour
     */
    select?: post_favourSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post_favour
     */
    omit?: post_favourOmit<ExtArgs> | null
    /**
     * Filter which post_favour to delete.
     */
    where: post_favourWhereUniqueInput
  }

  /**
   * post_favour deleteMany
   */
  export type post_favourDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which post_favours to delete
     */
    where?: post_favourWhereInput
    /**
     * Limit how many post_favours to delete.
     */
    limit?: number
  }

  /**
   * post_favour without action
   */
  export type post_favourDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post_favour
     */
    select?: post_favourSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post_favour
     */
    omit?: post_favourOmit<ExtArgs> | null
  }


  /**
   * Model post_thumb
   */

  export type AggregatePost_thumb = {
    _count: Post_thumbCountAggregateOutputType | null
    _avg: Post_thumbAvgAggregateOutputType | null
    _sum: Post_thumbSumAggregateOutputType | null
    _min: Post_thumbMinAggregateOutputType | null
    _max: Post_thumbMaxAggregateOutputType | null
  }

  export type Post_thumbAvgAggregateOutputType = {
    id: number | null
    postId: number | null
    userId: number | null
  }

  export type Post_thumbSumAggregateOutputType = {
    id: bigint | null
    postId: bigint | null
    userId: bigint | null
  }

  export type Post_thumbMinAggregateOutputType = {
    id: bigint | null
    postId: bigint | null
    userId: bigint | null
    createTime: Date | null
    updateTime: Date | null
  }

  export type Post_thumbMaxAggregateOutputType = {
    id: bigint | null
    postId: bigint | null
    userId: bigint | null
    createTime: Date | null
    updateTime: Date | null
  }

  export type Post_thumbCountAggregateOutputType = {
    id: number
    postId: number
    userId: number
    createTime: number
    updateTime: number
    _all: number
  }


  export type Post_thumbAvgAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
  }

  export type Post_thumbSumAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
  }

  export type Post_thumbMinAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    createTime?: true
    updateTime?: true
  }

  export type Post_thumbMaxAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    createTime?: true
    updateTime?: true
  }

  export type Post_thumbCountAggregateInputType = {
    id?: true
    postId?: true
    userId?: true
    createTime?: true
    updateTime?: true
    _all?: true
  }

  export type Post_thumbAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which post_thumb to aggregate.
     */
    where?: post_thumbWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of post_thumbs to fetch.
     */
    orderBy?: post_thumbOrderByWithRelationInput | post_thumbOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: post_thumbWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` post_thumbs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` post_thumbs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned post_thumbs
    **/
    _count?: true | Post_thumbCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Post_thumbAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Post_thumbSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Post_thumbMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Post_thumbMaxAggregateInputType
  }

  export type GetPost_thumbAggregateType<T extends Post_thumbAggregateArgs> = {
        [P in keyof T & keyof AggregatePost_thumb]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePost_thumb[P]>
      : GetScalarType<T[P], AggregatePost_thumb[P]>
  }




  export type post_thumbGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: post_thumbWhereInput
    orderBy?: post_thumbOrderByWithAggregationInput | post_thumbOrderByWithAggregationInput[]
    by: Post_thumbScalarFieldEnum[] | Post_thumbScalarFieldEnum
    having?: post_thumbScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Post_thumbCountAggregateInputType | true
    _avg?: Post_thumbAvgAggregateInputType
    _sum?: Post_thumbSumAggregateInputType
    _min?: Post_thumbMinAggregateInputType
    _max?: Post_thumbMaxAggregateInputType
  }

  export type Post_thumbGroupByOutputType = {
    id: bigint
    postId: bigint
    userId: bigint
    createTime: Date
    updateTime: Date
    _count: Post_thumbCountAggregateOutputType | null
    _avg: Post_thumbAvgAggregateOutputType | null
    _sum: Post_thumbSumAggregateOutputType | null
    _min: Post_thumbMinAggregateOutputType | null
    _max: Post_thumbMaxAggregateOutputType | null
  }

  type GetPost_thumbGroupByPayload<T extends post_thumbGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Post_thumbGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Post_thumbGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Post_thumbGroupByOutputType[P]>
            : GetScalarType<T[P], Post_thumbGroupByOutputType[P]>
        }
      >
    >


  export type post_thumbSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    postId?: boolean
    userId?: boolean
    createTime?: boolean
    updateTime?: boolean
  }, ExtArgs["result"]["post_thumb"]>



  export type post_thumbSelectScalar = {
    id?: boolean
    postId?: boolean
    userId?: boolean
    createTime?: boolean
    updateTime?: boolean
  }

  export type post_thumbOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "postId" | "userId" | "createTime" | "updateTime", ExtArgs["result"]["post_thumb"]>

  export type $post_thumbPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "post_thumb"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      postId: bigint
      userId: bigint
      createTime: Date
      updateTime: Date
    }, ExtArgs["result"]["post_thumb"]>
    composites: {}
  }

  type post_thumbGetPayload<S extends boolean | null | undefined | post_thumbDefaultArgs> = $Result.GetResult<Prisma.$post_thumbPayload, S>

  type post_thumbCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<post_thumbFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Post_thumbCountAggregateInputType | true
    }

  export interface post_thumbDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['post_thumb'], meta: { name: 'post_thumb' } }
    /**
     * Find zero or one Post_thumb that matches the filter.
     * @param {post_thumbFindUniqueArgs} args - Arguments to find a Post_thumb
     * @example
     * // Get one Post_thumb
     * const post_thumb = await prisma.post_thumb.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends post_thumbFindUniqueArgs>(args: SelectSubset<T, post_thumbFindUniqueArgs<ExtArgs>>): Prisma__post_thumbClient<$Result.GetResult<Prisma.$post_thumbPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Post_thumb that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {post_thumbFindUniqueOrThrowArgs} args - Arguments to find a Post_thumb
     * @example
     * // Get one Post_thumb
     * const post_thumb = await prisma.post_thumb.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends post_thumbFindUniqueOrThrowArgs>(args: SelectSubset<T, post_thumbFindUniqueOrThrowArgs<ExtArgs>>): Prisma__post_thumbClient<$Result.GetResult<Prisma.$post_thumbPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post_thumb that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {post_thumbFindFirstArgs} args - Arguments to find a Post_thumb
     * @example
     * // Get one Post_thumb
     * const post_thumb = await prisma.post_thumb.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends post_thumbFindFirstArgs>(args?: SelectSubset<T, post_thumbFindFirstArgs<ExtArgs>>): Prisma__post_thumbClient<$Result.GetResult<Prisma.$post_thumbPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post_thumb that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {post_thumbFindFirstOrThrowArgs} args - Arguments to find a Post_thumb
     * @example
     * // Get one Post_thumb
     * const post_thumb = await prisma.post_thumb.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends post_thumbFindFirstOrThrowArgs>(args?: SelectSubset<T, post_thumbFindFirstOrThrowArgs<ExtArgs>>): Prisma__post_thumbClient<$Result.GetResult<Prisma.$post_thumbPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Post_thumbs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {post_thumbFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Post_thumbs
     * const post_thumbs = await prisma.post_thumb.findMany()
     * 
     * // Get first 10 Post_thumbs
     * const post_thumbs = await prisma.post_thumb.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const post_thumbWithIdOnly = await prisma.post_thumb.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends post_thumbFindManyArgs>(args?: SelectSubset<T, post_thumbFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$post_thumbPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Post_thumb.
     * @param {post_thumbCreateArgs} args - Arguments to create a Post_thumb.
     * @example
     * // Create one Post_thumb
     * const Post_thumb = await prisma.post_thumb.create({
     *   data: {
     *     // ... data to create a Post_thumb
     *   }
     * })
     * 
     */
    create<T extends post_thumbCreateArgs>(args: SelectSubset<T, post_thumbCreateArgs<ExtArgs>>): Prisma__post_thumbClient<$Result.GetResult<Prisma.$post_thumbPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Post_thumbs.
     * @param {post_thumbCreateManyArgs} args - Arguments to create many Post_thumbs.
     * @example
     * // Create many Post_thumbs
     * const post_thumb = await prisma.post_thumb.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends post_thumbCreateManyArgs>(args?: SelectSubset<T, post_thumbCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Post_thumb.
     * @param {post_thumbDeleteArgs} args - Arguments to delete one Post_thumb.
     * @example
     * // Delete one Post_thumb
     * const Post_thumb = await prisma.post_thumb.delete({
     *   where: {
     *     // ... filter to delete one Post_thumb
     *   }
     * })
     * 
     */
    delete<T extends post_thumbDeleteArgs>(args: SelectSubset<T, post_thumbDeleteArgs<ExtArgs>>): Prisma__post_thumbClient<$Result.GetResult<Prisma.$post_thumbPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Post_thumb.
     * @param {post_thumbUpdateArgs} args - Arguments to update one Post_thumb.
     * @example
     * // Update one Post_thumb
     * const post_thumb = await prisma.post_thumb.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends post_thumbUpdateArgs>(args: SelectSubset<T, post_thumbUpdateArgs<ExtArgs>>): Prisma__post_thumbClient<$Result.GetResult<Prisma.$post_thumbPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Post_thumbs.
     * @param {post_thumbDeleteManyArgs} args - Arguments to filter Post_thumbs to delete.
     * @example
     * // Delete a few Post_thumbs
     * const { count } = await prisma.post_thumb.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends post_thumbDeleteManyArgs>(args?: SelectSubset<T, post_thumbDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Post_thumbs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {post_thumbUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Post_thumbs
     * const post_thumb = await prisma.post_thumb.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends post_thumbUpdateManyArgs>(args: SelectSubset<T, post_thumbUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Post_thumb.
     * @param {post_thumbUpsertArgs} args - Arguments to update or create a Post_thumb.
     * @example
     * // Update or create a Post_thumb
     * const post_thumb = await prisma.post_thumb.upsert({
     *   create: {
     *     // ... data to create a Post_thumb
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Post_thumb we want to update
     *   }
     * })
     */
    upsert<T extends post_thumbUpsertArgs>(args: SelectSubset<T, post_thumbUpsertArgs<ExtArgs>>): Prisma__post_thumbClient<$Result.GetResult<Prisma.$post_thumbPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Post_thumbs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {post_thumbCountArgs} args - Arguments to filter Post_thumbs to count.
     * @example
     * // Count the number of Post_thumbs
     * const count = await prisma.post_thumb.count({
     *   where: {
     *     // ... the filter for the Post_thumbs we want to count
     *   }
     * })
    **/
    count<T extends post_thumbCountArgs>(
      args?: Subset<T, post_thumbCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Post_thumbCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Post_thumb.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Post_thumbAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Post_thumbAggregateArgs>(args: Subset<T, Post_thumbAggregateArgs>): Prisma.PrismaPromise<GetPost_thumbAggregateType<T>>

    /**
     * Group by Post_thumb.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {post_thumbGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends post_thumbGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: post_thumbGroupByArgs['orderBy'] }
        : { orderBy?: post_thumbGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, post_thumbGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPost_thumbGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the post_thumb model
   */
  readonly fields: post_thumbFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for post_thumb.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__post_thumbClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the post_thumb model
   */
  interface post_thumbFieldRefs {
    readonly id: FieldRef<"post_thumb", 'BigInt'>
    readonly postId: FieldRef<"post_thumb", 'BigInt'>
    readonly userId: FieldRef<"post_thumb", 'BigInt'>
    readonly createTime: FieldRef<"post_thumb", 'DateTime'>
    readonly updateTime: FieldRef<"post_thumb", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * post_thumb findUnique
   */
  export type post_thumbFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post_thumb
     */
    select?: post_thumbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post_thumb
     */
    omit?: post_thumbOmit<ExtArgs> | null
    /**
     * Filter, which post_thumb to fetch.
     */
    where: post_thumbWhereUniqueInput
  }

  /**
   * post_thumb findUniqueOrThrow
   */
  export type post_thumbFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post_thumb
     */
    select?: post_thumbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post_thumb
     */
    omit?: post_thumbOmit<ExtArgs> | null
    /**
     * Filter, which post_thumb to fetch.
     */
    where: post_thumbWhereUniqueInput
  }

  /**
   * post_thumb findFirst
   */
  export type post_thumbFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post_thumb
     */
    select?: post_thumbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post_thumb
     */
    omit?: post_thumbOmit<ExtArgs> | null
    /**
     * Filter, which post_thumb to fetch.
     */
    where?: post_thumbWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of post_thumbs to fetch.
     */
    orderBy?: post_thumbOrderByWithRelationInput | post_thumbOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for post_thumbs.
     */
    cursor?: post_thumbWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` post_thumbs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` post_thumbs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of post_thumbs.
     */
    distinct?: Post_thumbScalarFieldEnum | Post_thumbScalarFieldEnum[]
  }

  /**
   * post_thumb findFirstOrThrow
   */
  export type post_thumbFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post_thumb
     */
    select?: post_thumbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post_thumb
     */
    omit?: post_thumbOmit<ExtArgs> | null
    /**
     * Filter, which post_thumb to fetch.
     */
    where?: post_thumbWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of post_thumbs to fetch.
     */
    orderBy?: post_thumbOrderByWithRelationInput | post_thumbOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for post_thumbs.
     */
    cursor?: post_thumbWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` post_thumbs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` post_thumbs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of post_thumbs.
     */
    distinct?: Post_thumbScalarFieldEnum | Post_thumbScalarFieldEnum[]
  }

  /**
   * post_thumb findMany
   */
  export type post_thumbFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post_thumb
     */
    select?: post_thumbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post_thumb
     */
    omit?: post_thumbOmit<ExtArgs> | null
    /**
     * Filter, which post_thumbs to fetch.
     */
    where?: post_thumbWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of post_thumbs to fetch.
     */
    orderBy?: post_thumbOrderByWithRelationInput | post_thumbOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing post_thumbs.
     */
    cursor?: post_thumbWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` post_thumbs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` post_thumbs.
     */
    skip?: number
    distinct?: Post_thumbScalarFieldEnum | Post_thumbScalarFieldEnum[]
  }

  /**
   * post_thumb create
   */
  export type post_thumbCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post_thumb
     */
    select?: post_thumbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post_thumb
     */
    omit?: post_thumbOmit<ExtArgs> | null
    /**
     * The data needed to create a post_thumb.
     */
    data: XOR<post_thumbCreateInput, post_thumbUncheckedCreateInput>
  }

  /**
   * post_thumb createMany
   */
  export type post_thumbCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many post_thumbs.
     */
    data: post_thumbCreateManyInput | post_thumbCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * post_thumb update
   */
  export type post_thumbUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post_thumb
     */
    select?: post_thumbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post_thumb
     */
    omit?: post_thumbOmit<ExtArgs> | null
    /**
     * The data needed to update a post_thumb.
     */
    data: XOR<post_thumbUpdateInput, post_thumbUncheckedUpdateInput>
    /**
     * Choose, which post_thumb to update.
     */
    where: post_thumbWhereUniqueInput
  }

  /**
   * post_thumb updateMany
   */
  export type post_thumbUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update post_thumbs.
     */
    data: XOR<post_thumbUpdateManyMutationInput, post_thumbUncheckedUpdateManyInput>
    /**
     * Filter which post_thumbs to update
     */
    where?: post_thumbWhereInput
    /**
     * Limit how many post_thumbs to update.
     */
    limit?: number
  }

  /**
   * post_thumb upsert
   */
  export type post_thumbUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post_thumb
     */
    select?: post_thumbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post_thumb
     */
    omit?: post_thumbOmit<ExtArgs> | null
    /**
     * The filter to search for the post_thumb to update in case it exists.
     */
    where: post_thumbWhereUniqueInput
    /**
     * In case the post_thumb found by the `where` argument doesn't exist, create a new post_thumb with this data.
     */
    create: XOR<post_thumbCreateInput, post_thumbUncheckedCreateInput>
    /**
     * In case the post_thumb was found with the provided `where` argument, update it with this data.
     */
    update: XOR<post_thumbUpdateInput, post_thumbUncheckedUpdateInput>
  }

  /**
   * post_thumb delete
   */
  export type post_thumbDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post_thumb
     */
    select?: post_thumbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post_thumb
     */
    omit?: post_thumbOmit<ExtArgs> | null
    /**
     * Filter which post_thumb to delete.
     */
    where: post_thumbWhereUniqueInput
  }

  /**
   * post_thumb deleteMany
   */
  export type post_thumbDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which post_thumbs to delete
     */
    where?: post_thumbWhereInput
    /**
     * Limit how many post_thumbs to delete.
     */
    limit?: number
  }

  /**
   * post_thumb without action
   */
  export type post_thumbDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the post_thumb
     */
    select?: post_thumbSelect<ExtArgs> | null
    /**
     * Omit specific fields from the post_thumb
     */
    omit?: post_thumbOmit<ExtArgs> | null
  }


  /**
   * Model user
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
    isDelete: number | null
  }

  export type UserSumAggregateOutputType = {
    id: bigint | null
    isDelete: number | null
  }

  export type UserMinAggregateOutputType = {
    id: bigint | null
    userAccount: string | null
    userPassword: string | null
    unionId: string | null
    mpOpenId: string | null
    userName: string | null
    userAvatar: string | null
    userProfile: string | null
    userRole: string | null
    createTime: Date | null
    updateTime: Date | null
    isDelete: number | null
  }

  export type UserMaxAggregateOutputType = {
    id: bigint | null
    userAccount: string | null
    userPassword: string | null
    unionId: string | null
    mpOpenId: string | null
    userName: string | null
    userAvatar: string | null
    userProfile: string | null
    userRole: string | null
    createTime: Date | null
    updateTime: Date | null
    isDelete: number | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    userAccount: number
    userPassword: number
    unionId: number
    mpOpenId: number
    userName: number
    userAvatar: number
    userProfile: number
    userRole: number
    createTime: number
    updateTime: number
    isDelete: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
    isDelete?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
    isDelete?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    userAccount?: true
    userPassword?: true
    unionId?: true
    mpOpenId?: true
    userName?: true
    userAvatar?: true
    userProfile?: true
    userRole?: true
    createTime?: true
    updateTime?: true
    isDelete?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    userAccount?: true
    userPassword?: true
    unionId?: true
    mpOpenId?: true
    userName?: true
    userAvatar?: true
    userProfile?: true
    userRole?: true
    createTime?: true
    updateTime?: true
    isDelete?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    userAccount?: true
    userPassword?: true
    unionId?: true
    mpOpenId?: true
    userName?: true
    userAvatar?: true
    userProfile?: true
    userRole?: true
    createTime?: true
    updateTime?: true
    isDelete?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user to aggregate.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type userGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: userWhereInput
    orderBy?: userOrderByWithAggregationInput | userOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: userScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: bigint
    userAccount: string
    userPassword: string
    unionId: string | null
    mpOpenId: string | null
    userName: string | null
    userAvatar: string | null
    userProfile: string | null
    userRole: string
    createTime: Date
    updateTime: Date
    isDelete: number
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends userGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type userSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userAccount?: boolean
    userPassword?: boolean
    unionId?: boolean
    mpOpenId?: boolean
    userName?: boolean
    userAvatar?: boolean
    userProfile?: boolean
    userRole?: boolean
    createTime?: boolean
    updateTime?: boolean
    isDelete?: boolean
    audio_file?: boolean | user$audio_fileArgs<ExtArgs>
    user_config?: boolean | user$user_configArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type userSelectScalar = {
    id?: boolean
    userAccount?: boolean
    userPassword?: boolean
    unionId?: boolean
    mpOpenId?: boolean
    userName?: boolean
    userAvatar?: boolean
    userProfile?: boolean
    userRole?: boolean
    createTime?: boolean
    updateTime?: boolean
    isDelete?: boolean
  }

  export type userOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userAccount" | "userPassword" | "unionId" | "mpOpenId" | "userName" | "userAvatar" | "userProfile" | "userRole" | "createTime" | "updateTime" | "isDelete", ExtArgs["result"]["user"]>
  export type userInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    audio_file?: boolean | user$audio_fileArgs<ExtArgs>
    user_config?: boolean | user$user_configArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $userPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "user"
    objects: {
      audio_file: Prisma.$audio_filePayload<ExtArgs>[]
      user_config: Prisma.$user_configPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      userAccount: string
      userPassword: string
      unionId: string | null
      mpOpenId: string | null
      userName: string | null
      userAvatar: string | null
      userProfile: string | null
      userRole: string
      createTime: Date
      updateTime: Date
      isDelete: number
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type userGetPayload<S extends boolean | null | undefined | userDefaultArgs> = $Result.GetResult<Prisma.$userPayload, S>

  type userCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<userFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface userDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user'], meta: { name: 'user' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {userFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends userFindUniqueArgs>(args: SelectSubset<T, userFindUniqueArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {userFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends userFindUniqueOrThrowArgs>(args: SelectSubset<T, userFindUniqueOrThrowArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends userFindFirstArgs>(args?: SelectSubset<T, userFindFirstArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends userFindFirstOrThrowArgs>(args?: SelectSubset<T, userFindFirstOrThrowArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends userFindManyArgs>(args?: SelectSubset<T, userFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {userCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends userCreateArgs>(args: SelectSubset<T, userCreateArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {userCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends userCreateManyArgs>(args?: SelectSubset<T, userCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {userDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends userDeleteArgs>(args: SelectSubset<T, userDeleteArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {userUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends userUpdateArgs>(args: SelectSubset<T, userUpdateArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {userDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends userDeleteManyArgs>(args?: SelectSubset<T, userDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends userUpdateManyArgs>(args: SelectSubset<T, userUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {userUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends userUpsertArgs>(args: SelectSubset<T, userUpsertArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends userCountArgs>(
      args?: Subset<T, userCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends userGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: userGroupByArgs['orderBy'] }
        : { orderBy?: userGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, userGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the user model
   */
  readonly fields: userFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for user.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__userClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    audio_file<T extends user$audio_fileArgs<ExtArgs> = {}>(args?: Subset<T, user$audio_fileArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$audio_filePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user_config<T extends user$user_configArgs<ExtArgs> = {}>(args?: Subset<T, user$user_configArgs<ExtArgs>>): Prisma__user_configClient<$Result.GetResult<Prisma.$user_configPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the user model
   */
  interface userFieldRefs {
    readonly id: FieldRef<"user", 'BigInt'>
    readonly userAccount: FieldRef<"user", 'String'>
    readonly userPassword: FieldRef<"user", 'String'>
    readonly unionId: FieldRef<"user", 'String'>
    readonly mpOpenId: FieldRef<"user", 'String'>
    readonly userName: FieldRef<"user", 'String'>
    readonly userAvatar: FieldRef<"user", 'String'>
    readonly userProfile: FieldRef<"user", 'String'>
    readonly userRole: FieldRef<"user", 'String'>
    readonly createTime: FieldRef<"user", 'DateTime'>
    readonly updateTime: FieldRef<"user", 'DateTime'>
    readonly isDelete: FieldRef<"user", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * user findUnique
   */
  export type userFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where: userWhereUniqueInput
  }

  /**
   * user findUniqueOrThrow
   */
  export type userFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where: userWhereUniqueInput
  }

  /**
   * user findFirst
   */
  export type userFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user findFirstOrThrow
   */
  export type userFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user findMany
   */
  export type userFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user create
   */
  export type userCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The data needed to create a user.
     */
    data: XOR<userCreateInput, userUncheckedCreateInput>
  }

  /**
   * user createMany
   */
  export type userCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: userCreateManyInput | userCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * user update
   */
  export type userUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The data needed to update a user.
     */
    data: XOR<userUpdateInput, userUncheckedUpdateInput>
    /**
     * Choose, which user to update.
     */
    where: userWhereUniqueInput
  }

  /**
   * user updateMany
   */
  export type userUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<userUpdateManyMutationInput, userUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: userWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * user upsert
   */
  export type userUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The filter to search for the user to update in case it exists.
     */
    where: userWhereUniqueInput
    /**
     * In case the user found by the `where` argument doesn't exist, create a new user with this data.
     */
    create: XOR<userCreateInput, userUncheckedCreateInput>
    /**
     * In case the user was found with the provided `where` argument, update it with this data.
     */
    update: XOR<userUpdateInput, userUncheckedUpdateInput>
  }

  /**
   * user delete
   */
  export type userDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter which user to delete.
     */
    where: userWhereUniqueInput
  }

  /**
   * user deleteMany
   */
  export type userDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: userWhereInput
    /**
     * Limit how many users to delete.
     */
    limit?: number
  }

  /**
   * user.audio_file
   */
  export type user$audio_fileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audio_file
     */
    select?: audio_fileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audio_file
     */
    omit?: audio_fileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: audio_fileInclude<ExtArgs> | null
    where?: audio_fileWhereInput
    orderBy?: audio_fileOrderByWithRelationInput | audio_fileOrderByWithRelationInput[]
    cursor?: audio_fileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Audio_fileScalarFieldEnum | Audio_fileScalarFieldEnum[]
  }

  /**
   * user.user_config
   */
  export type user$user_configArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_config
     */
    select?: user_configSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_config
     */
    omit?: user_configOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_configInclude<ExtArgs> | null
    where?: user_configWhereInput
  }

  /**
   * user without action
   */
  export type userDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
  }


  /**
   * Model user_config
   */

  export type AggregateUser_config = {
    _count: User_configCountAggregateOutputType | null
    _avg: User_configAvgAggregateOutputType | null
    _sum: User_configSumAggregateOutputType | null
    _min: User_configMinAggregateOutputType | null
    _max: User_configMaxAggregateOutputType | null
  }

  export type User_configAvgAggregateOutputType = {
    user_id: number | null
  }

  export type User_configSumAggregateOutputType = {
    user_id: bigint | null
  }

  export type User_configMinAggregateOutputType = {
    user_id: bigint | null
    update_time: Date | null
  }

  export type User_configMaxAggregateOutputType = {
    user_id: bigint | null
    update_time: Date | null
  }

  export type User_configCountAggregateOutputType = {
    user_id: number
    config_json: number
    update_time: number
    _all: number
  }


  export type User_configAvgAggregateInputType = {
    user_id?: true
  }

  export type User_configSumAggregateInputType = {
    user_id?: true
  }

  export type User_configMinAggregateInputType = {
    user_id?: true
    update_time?: true
  }

  export type User_configMaxAggregateInputType = {
    user_id?: true
    update_time?: true
  }

  export type User_configCountAggregateInputType = {
    user_id?: true
    config_json?: true
    update_time?: true
    _all?: true
  }

  export type User_configAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_config to aggregate.
     */
    where?: user_configWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_configs to fetch.
     */
    orderBy?: user_configOrderByWithRelationInput | user_configOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: user_configWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_configs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_configs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned user_configs
    **/
    _count?: true | User_configCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: User_configAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: User_configSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: User_configMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: User_configMaxAggregateInputType
  }

  export type GetUser_configAggregateType<T extends User_configAggregateArgs> = {
        [P in keyof T & keyof AggregateUser_config]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser_config[P]>
      : GetScalarType<T[P], AggregateUser_config[P]>
  }




  export type user_configGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: user_configWhereInput
    orderBy?: user_configOrderByWithAggregationInput | user_configOrderByWithAggregationInput[]
    by: User_configScalarFieldEnum[] | User_configScalarFieldEnum
    having?: user_configScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: User_configCountAggregateInputType | true
    _avg?: User_configAvgAggregateInputType
    _sum?: User_configSumAggregateInputType
    _min?: User_configMinAggregateInputType
    _max?: User_configMaxAggregateInputType
  }

  export type User_configGroupByOutputType = {
    user_id: bigint
    config_json: JsonValue
    update_time: Date | null
    _count: User_configCountAggregateOutputType | null
    _avg: User_configAvgAggregateOutputType | null
    _sum: User_configSumAggregateOutputType | null
    _min: User_configMinAggregateOutputType | null
    _max: User_configMaxAggregateOutputType | null
  }

  type GetUser_configGroupByPayload<T extends user_configGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<User_configGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof User_configGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], User_configGroupByOutputType[P]>
            : GetScalarType<T[P], User_configGroupByOutputType[P]>
        }
      >
    >


  export type user_configSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    config_json?: boolean
    update_time?: boolean
    user?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user_config"]>



  export type user_configSelectScalar = {
    user_id?: boolean
    config_json?: boolean
    update_time?: boolean
  }

  export type user_configOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"user_id" | "config_json" | "update_time", ExtArgs["result"]["user_config"]>
  export type user_configInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | userDefaultArgs<ExtArgs>
  }

  export type $user_configPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "user_config"
    objects: {
      user: Prisma.$userPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      user_id: bigint
      config_json: Prisma.JsonValue
      update_time: Date | null
    }, ExtArgs["result"]["user_config"]>
    composites: {}
  }

  type user_configGetPayload<S extends boolean | null | undefined | user_configDefaultArgs> = $Result.GetResult<Prisma.$user_configPayload, S>

  type user_configCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<user_configFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: User_configCountAggregateInputType | true
    }

  export interface user_configDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user_config'], meta: { name: 'user_config' } }
    /**
     * Find zero or one User_config that matches the filter.
     * @param {user_configFindUniqueArgs} args - Arguments to find a User_config
     * @example
     * // Get one User_config
     * const user_config = await prisma.user_config.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends user_configFindUniqueArgs>(args: SelectSubset<T, user_configFindUniqueArgs<ExtArgs>>): Prisma__user_configClient<$Result.GetResult<Prisma.$user_configPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User_config that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {user_configFindUniqueOrThrowArgs} args - Arguments to find a User_config
     * @example
     * // Get one User_config
     * const user_config = await prisma.user_config.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends user_configFindUniqueOrThrowArgs>(args: SelectSubset<T, user_configFindUniqueOrThrowArgs<ExtArgs>>): Prisma__user_configClient<$Result.GetResult<Prisma.$user_configPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User_config that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_configFindFirstArgs} args - Arguments to find a User_config
     * @example
     * // Get one User_config
     * const user_config = await prisma.user_config.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends user_configFindFirstArgs>(args?: SelectSubset<T, user_configFindFirstArgs<ExtArgs>>): Prisma__user_configClient<$Result.GetResult<Prisma.$user_configPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User_config that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_configFindFirstOrThrowArgs} args - Arguments to find a User_config
     * @example
     * // Get one User_config
     * const user_config = await prisma.user_config.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends user_configFindFirstOrThrowArgs>(args?: SelectSubset<T, user_configFindFirstOrThrowArgs<ExtArgs>>): Prisma__user_configClient<$Result.GetResult<Prisma.$user_configPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more User_configs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_configFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all User_configs
     * const user_configs = await prisma.user_config.findMany()
     * 
     * // Get first 10 User_configs
     * const user_configs = await prisma.user_config.findMany({ take: 10 })
     * 
     * // Only select the `user_id`
     * const user_configWithUser_idOnly = await prisma.user_config.findMany({ select: { user_id: true } })
     * 
     */
    findMany<T extends user_configFindManyArgs>(args?: SelectSubset<T, user_configFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_configPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User_config.
     * @param {user_configCreateArgs} args - Arguments to create a User_config.
     * @example
     * // Create one User_config
     * const User_config = await prisma.user_config.create({
     *   data: {
     *     // ... data to create a User_config
     *   }
     * })
     * 
     */
    create<T extends user_configCreateArgs>(args: SelectSubset<T, user_configCreateArgs<ExtArgs>>): Prisma__user_configClient<$Result.GetResult<Prisma.$user_configPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many User_configs.
     * @param {user_configCreateManyArgs} args - Arguments to create many User_configs.
     * @example
     * // Create many User_configs
     * const user_config = await prisma.user_config.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends user_configCreateManyArgs>(args?: SelectSubset<T, user_configCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User_config.
     * @param {user_configDeleteArgs} args - Arguments to delete one User_config.
     * @example
     * // Delete one User_config
     * const User_config = await prisma.user_config.delete({
     *   where: {
     *     // ... filter to delete one User_config
     *   }
     * })
     * 
     */
    delete<T extends user_configDeleteArgs>(args: SelectSubset<T, user_configDeleteArgs<ExtArgs>>): Prisma__user_configClient<$Result.GetResult<Prisma.$user_configPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User_config.
     * @param {user_configUpdateArgs} args - Arguments to update one User_config.
     * @example
     * // Update one User_config
     * const user_config = await prisma.user_config.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends user_configUpdateArgs>(args: SelectSubset<T, user_configUpdateArgs<ExtArgs>>): Prisma__user_configClient<$Result.GetResult<Prisma.$user_configPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more User_configs.
     * @param {user_configDeleteManyArgs} args - Arguments to filter User_configs to delete.
     * @example
     * // Delete a few User_configs
     * const { count } = await prisma.user_config.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends user_configDeleteManyArgs>(args?: SelectSubset<T, user_configDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_configs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_configUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many User_configs
     * const user_config = await prisma.user_config.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends user_configUpdateManyArgs>(args: SelectSubset<T, user_configUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User_config.
     * @param {user_configUpsertArgs} args - Arguments to update or create a User_config.
     * @example
     * // Update or create a User_config
     * const user_config = await prisma.user_config.upsert({
     *   create: {
     *     // ... data to create a User_config
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User_config we want to update
     *   }
     * })
     */
    upsert<T extends user_configUpsertArgs>(args: SelectSubset<T, user_configUpsertArgs<ExtArgs>>): Prisma__user_configClient<$Result.GetResult<Prisma.$user_configPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of User_configs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_configCountArgs} args - Arguments to filter User_configs to count.
     * @example
     * // Count the number of User_configs
     * const count = await prisma.user_config.count({
     *   where: {
     *     // ... the filter for the User_configs we want to count
     *   }
     * })
    **/
    count<T extends user_configCountArgs>(
      args?: Subset<T, user_configCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], User_configCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User_config.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_configAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends User_configAggregateArgs>(args: Subset<T, User_configAggregateArgs>): Prisma.PrismaPromise<GetUser_configAggregateType<T>>

    /**
     * Group by User_config.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_configGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends user_configGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: user_configGroupByArgs['orderBy'] }
        : { orderBy?: user_configGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, user_configGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUser_configGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the user_config model
   */
  readonly fields: user_configFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for user_config.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__user_configClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends userDefaultArgs<ExtArgs> = {}>(args?: Subset<T, userDefaultArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the user_config model
   */
  interface user_configFieldRefs {
    readonly user_id: FieldRef<"user_config", 'BigInt'>
    readonly config_json: FieldRef<"user_config", 'Json'>
    readonly update_time: FieldRef<"user_config", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * user_config findUnique
   */
  export type user_configFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_config
     */
    select?: user_configSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_config
     */
    omit?: user_configOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_configInclude<ExtArgs> | null
    /**
     * Filter, which user_config to fetch.
     */
    where: user_configWhereUniqueInput
  }

  /**
   * user_config findUniqueOrThrow
   */
  export type user_configFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_config
     */
    select?: user_configSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_config
     */
    omit?: user_configOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_configInclude<ExtArgs> | null
    /**
     * Filter, which user_config to fetch.
     */
    where: user_configWhereUniqueInput
  }

  /**
   * user_config findFirst
   */
  export type user_configFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_config
     */
    select?: user_configSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_config
     */
    omit?: user_configOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_configInclude<ExtArgs> | null
    /**
     * Filter, which user_config to fetch.
     */
    where?: user_configWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_configs to fetch.
     */
    orderBy?: user_configOrderByWithRelationInput | user_configOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_configs.
     */
    cursor?: user_configWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_configs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_configs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_configs.
     */
    distinct?: User_configScalarFieldEnum | User_configScalarFieldEnum[]
  }

  /**
   * user_config findFirstOrThrow
   */
  export type user_configFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_config
     */
    select?: user_configSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_config
     */
    omit?: user_configOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_configInclude<ExtArgs> | null
    /**
     * Filter, which user_config to fetch.
     */
    where?: user_configWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_configs to fetch.
     */
    orderBy?: user_configOrderByWithRelationInput | user_configOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_configs.
     */
    cursor?: user_configWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_configs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_configs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_configs.
     */
    distinct?: User_configScalarFieldEnum | User_configScalarFieldEnum[]
  }

  /**
   * user_config findMany
   */
  export type user_configFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_config
     */
    select?: user_configSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_config
     */
    omit?: user_configOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_configInclude<ExtArgs> | null
    /**
     * Filter, which user_configs to fetch.
     */
    where?: user_configWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_configs to fetch.
     */
    orderBy?: user_configOrderByWithRelationInput | user_configOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing user_configs.
     */
    cursor?: user_configWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_configs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_configs.
     */
    skip?: number
    distinct?: User_configScalarFieldEnum | User_configScalarFieldEnum[]
  }

  /**
   * user_config create
   */
  export type user_configCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_config
     */
    select?: user_configSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_config
     */
    omit?: user_configOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_configInclude<ExtArgs> | null
    /**
     * The data needed to create a user_config.
     */
    data: XOR<user_configCreateInput, user_configUncheckedCreateInput>
  }

  /**
   * user_config createMany
   */
  export type user_configCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many user_configs.
     */
    data: user_configCreateManyInput | user_configCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * user_config update
   */
  export type user_configUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_config
     */
    select?: user_configSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_config
     */
    omit?: user_configOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_configInclude<ExtArgs> | null
    /**
     * The data needed to update a user_config.
     */
    data: XOR<user_configUpdateInput, user_configUncheckedUpdateInput>
    /**
     * Choose, which user_config to update.
     */
    where: user_configWhereUniqueInput
  }

  /**
   * user_config updateMany
   */
  export type user_configUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update user_configs.
     */
    data: XOR<user_configUpdateManyMutationInput, user_configUncheckedUpdateManyInput>
    /**
     * Filter which user_configs to update
     */
    where?: user_configWhereInput
    /**
     * Limit how many user_configs to update.
     */
    limit?: number
  }

  /**
   * user_config upsert
   */
  export type user_configUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_config
     */
    select?: user_configSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_config
     */
    omit?: user_configOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_configInclude<ExtArgs> | null
    /**
     * The filter to search for the user_config to update in case it exists.
     */
    where: user_configWhereUniqueInput
    /**
     * In case the user_config found by the `where` argument doesn't exist, create a new user_config with this data.
     */
    create: XOR<user_configCreateInput, user_configUncheckedCreateInput>
    /**
     * In case the user_config was found with the provided `where` argument, update it with this data.
     */
    update: XOR<user_configUpdateInput, user_configUncheckedUpdateInput>
  }

  /**
   * user_config delete
   */
  export type user_configDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_config
     */
    select?: user_configSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_config
     */
    omit?: user_configOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_configInclude<ExtArgs> | null
    /**
     * Filter which user_config to delete.
     */
    where: user_configWhereUniqueInput
  }

  /**
   * user_config deleteMany
   */
  export type user_configDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_configs to delete
     */
    where?: user_configWhereInput
    /**
     * Limit how many user_configs to delete.
     */
    limit?: number
  }

  /**
   * user_config without action
   */
  export type user_configDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_config
     */
    select?: user_configSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_config
     */
    omit?: user_configOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_configInclude<ExtArgs> | null
  }


  /**
   * Model word_status_change
   */

  export type AggregateWord_status_change = {
    _count: Word_status_changeCountAggregateOutputType | null
    _avg: Word_status_changeAvgAggregateOutputType | null
    _sum: Word_status_changeSumAggregateOutputType | null
    _min: Word_status_changeMinAggregateOutputType | null
    _max: Word_status_changeMaxAggregateOutputType | null
  }

  export type Word_status_changeAvgAggregateOutputType = {
    id: number | null
    word_id: number | null
    is_delete: number | null
  }

  export type Word_status_changeSumAggregateOutputType = {
    id: bigint | null
    word_id: bigint | null
    is_delete: number | null
  }

  export type Word_status_changeMinAggregateOutputType = {
    id: bigint | null
    word_id: bigint | null
    status: string | null
    comment: string | null
    create_time: Date | null
    update_time: Date | null
    is_delete: number | null
  }

  export type Word_status_changeMaxAggregateOutputType = {
    id: bigint | null
    word_id: bigint | null
    status: string | null
    comment: string | null
    create_time: Date | null
    update_time: Date | null
    is_delete: number | null
  }

  export type Word_status_changeCountAggregateOutputType = {
    id: number
    word_id: number
    status: number
    info: number
    comment: number
    create_time: number
    update_time: number
    is_delete: number
    _all: number
  }


  export type Word_status_changeAvgAggregateInputType = {
    id?: true
    word_id?: true
    is_delete?: true
  }

  export type Word_status_changeSumAggregateInputType = {
    id?: true
    word_id?: true
    is_delete?: true
  }

  export type Word_status_changeMinAggregateInputType = {
    id?: true
    word_id?: true
    status?: true
    comment?: true
    create_time?: true
    update_time?: true
    is_delete?: true
  }

  export type Word_status_changeMaxAggregateInputType = {
    id?: true
    word_id?: true
    status?: true
    comment?: true
    create_time?: true
    update_time?: true
    is_delete?: true
  }

  export type Word_status_changeCountAggregateInputType = {
    id?: true
    word_id?: true
    status?: true
    info?: true
    comment?: true
    create_time?: true
    update_time?: true
    is_delete?: true
    _all?: true
  }

  export type Word_status_changeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which word_status_change to aggregate.
     */
    where?: word_status_changeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of word_status_changes to fetch.
     */
    orderBy?: word_status_changeOrderByWithRelationInput | word_status_changeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: word_status_changeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` word_status_changes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` word_status_changes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned word_status_changes
    **/
    _count?: true | Word_status_changeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Word_status_changeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Word_status_changeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Word_status_changeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Word_status_changeMaxAggregateInputType
  }

  export type GetWord_status_changeAggregateType<T extends Word_status_changeAggregateArgs> = {
        [P in keyof T & keyof AggregateWord_status_change]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWord_status_change[P]>
      : GetScalarType<T[P], AggregateWord_status_change[P]>
  }




  export type word_status_changeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: word_status_changeWhereInput
    orderBy?: word_status_changeOrderByWithAggregationInput | word_status_changeOrderByWithAggregationInput[]
    by: Word_status_changeScalarFieldEnum[] | Word_status_changeScalarFieldEnum
    having?: word_status_changeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Word_status_changeCountAggregateInputType | true
    _avg?: Word_status_changeAvgAggregateInputType
    _sum?: Word_status_changeSumAggregateInputType
    _min?: Word_status_changeMinAggregateInputType
    _max?: Word_status_changeMaxAggregateInputType
  }

  export type Word_status_changeGroupByOutputType = {
    id: bigint
    word_id: bigint
    status: string
    info: JsonValue | null
    comment: string | null
    create_time: Date | null
    update_time: Date | null
    is_delete: number | null
    _count: Word_status_changeCountAggregateOutputType | null
    _avg: Word_status_changeAvgAggregateOutputType | null
    _sum: Word_status_changeSumAggregateOutputType | null
    _min: Word_status_changeMinAggregateOutputType | null
    _max: Word_status_changeMaxAggregateOutputType | null
  }

  type GetWord_status_changeGroupByPayload<T extends word_status_changeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Word_status_changeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Word_status_changeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Word_status_changeGroupByOutputType[P]>
            : GetScalarType<T[P], Word_status_changeGroupByOutputType[P]>
        }
      >
    >


  export type word_status_changeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    word_id?: boolean
    status?: boolean
    info?: boolean
    comment?: boolean
    create_time?: boolean
    update_time?: boolean
    is_delete?: boolean
  }, ExtArgs["result"]["word_status_change"]>



  export type word_status_changeSelectScalar = {
    id?: boolean
    word_id?: boolean
    status?: boolean
    info?: boolean
    comment?: boolean
    create_time?: boolean
    update_time?: boolean
    is_delete?: boolean
  }

  export type word_status_changeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "word_id" | "status" | "info" | "comment" | "create_time" | "update_time" | "is_delete", ExtArgs["result"]["word_status_change"]>

  export type $word_status_changePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "word_status_change"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      word_id: bigint
      status: string
      info: Prisma.JsonValue | null
      comment: string | null
      create_time: Date | null
      update_time: Date | null
      is_delete: number | null
    }, ExtArgs["result"]["word_status_change"]>
    composites: {}
  }

  type word_status_changeGetPayload<S extends boolean | null | undefined | word_status_changeDefaultArgs> = $Result.GetResult<Prisma.$word_status_changePayload, S>

  type word_status_changeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<word_status_changeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Word_status_changeCountAggregateInputType | true
    }

  export interface word_status_changeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['word_status_change'], meta: { name: 'word_status_change' } }
    /**
     * Find zero or one Word_status_change that matches the filter.
     * @param {word_status_changeFindUniqueArgs} args - Arguments to find a Word_status_change
     * @example
     * // Get one Word_status_change
     * const word_status_change = await prisma.word_status_change.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends word_status_changeFindUniqueArgs>(args: SelectSubset<T, word_status_changeFindUniqueArgs<ExtArgs>>): Prisma__word_status_changeClient<$Result.GetResult<Prisma.$word_status_changePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Word_status_change that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {word_status_changeFindUniqueOrThrowArgs} args - Arguments to find a Word_status_change
     * @example
     * // Get one Word_status_change
     * const word_status_change = await prisma.word_status_change.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends word_status_changeFindUniqueOrThrowArgs>(args: SelectSubset<T, word_status_changeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__word_status_changeClient<$Result.GetResult<Prisma.$word_status_changePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Word_status_change that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {word_status_changeFindFirstArgs} args - Arguments to find a Word_status_change
     * @example
     * // Get one Word_status_change
     * const word_status_change = await prisma.word_status_change.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends word_status_changeFindFirstArgs>(args?: SelectSubset<T, word_status_changeFindFirstArgs<ExtArgs>>): Prisma__word_status_changeClient<$Result.GetResult<Prisma.$word_status_changePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Word_status_change that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {word_status_changeFindFirstOrThrowArgs} args - Arguments to find a Word_status_change
     * @example
     * // Get one Word_status_change
     * const word_status_change = await prisma.word_status_change.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends word_status_changeFindFirstOrThrowArgs>(args?: SelectSubset<T, word_status_changeFindFirstOrThrowArgs<ExtArgs>>): Prisma__word_status_changeClient<$Result.GetResult<Prisma.$word_status_changePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Word_status_changes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {word_status_changeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Word_status_changes
     * const word_status_changes = await prisma.word_status_change.findMany()
     * 
     * // Get first 10 Word_status_changes
     * const word_status_changes = await prisma.word_status_change.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const word_status_changeWithIdOnly = await prisma.word_status_change.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends word_status_changeFindManyArgs>(args?: SelectSubset<T, word_status_changeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$word_status_changePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Word_status_change.
     * @param {word_status_changeCreateArgs} args - Arguments to create a Word_status_change.
     * @example
     * // Create one Word_status_change
     * const Word_status_change = await prisma.word_status_change.create({
     *   data: {
     *     // ... data to create a Word_status_change
     *   }
     * })
     * 
     */
    create<T extends word_status_changeCreateArgs>(args: SelectSubset<T, word_status_changeCreateArgs<ExtArgs>>): Prisma__word_status_changeClient<$Result.GetResult<Prisma.$word_status_changePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Word_status_changes.
     * @param {word_status_changeCreateManyArgs} args - Arguments to create many Word_status_changes.
     * @example
     * // Create many Word_status_changes
     * const word_status_change = await prisma.word_status_change.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends word_status_changeCreateManyArgs>(args?: SelectSubset<T, word_status_changeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Word_status_change.
     * @param {word_status_changeDeleteArgs} args - Arguments to delete one Word_status_change.
     * @example
     * // Delete one Word_status_change
     * const Word_status_change = await prisma.word_status_change.delete({
     *   where: {
     *     // ... filter to delete one Word_status_change
     *   }
     * })
     * 
     */
    delete<T extends word_status_changeDeleteArgs>(args: SelectSubset<T, word_status_changeDeleteArgs<ExtArgs>>): Prisma__word_status_changeClient<$Result.GetResult<Prisma.$word_status_changePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Word_status_change.
     * @param {word_status_changeUpdateArgs} args - Arguments to update one Word_status_change.
     * @example
     * // Update one Word_status_change
     * const word_status_change = await prisma.word_status_change.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends word_status_changeUpdateArgs>(args: SelectSubset<T, word_status_changeUpdateArgs<ExtArgs>>): Prisma__word_status_changeClient<$Result.GetResult<Prisma.$word_status_changePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Word_status_changes.
     * @param {word_status_changeDeleteManyArgs} args - Arguments to filter Word_status_changes to delete.
     * @example
     * // Delete a few Word_status_changes
     * const { count } = await prisma.word_status_change.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends word_status_changeDeleteManyArgs>(args?: SelectSubset<T, word_status_changeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Word_status_changes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {word_status_changeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Word_status_changes
     * const word_status_change = await prisma.word_status_change.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends word_status_changeUpdateManyArgs>(args: SelectSubset<T, word_status_changeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Word_status_change.
     * @param {word_status_changeUpsertArgs} args - Arguments to update or create a Word_status_change.
     * @example
     * // Update or create a Word_status_change
     * const word_status_change = await prisma.word_status_change.upsert({
     *   create: {
     *     // ... data to create a Word_status_change
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Word_status_change we want to update
     *   }
     * })
     */
    upsert<T extends word_status_changeUpsertArgs>(args: SelectSubset<T, word_status_changeUpsertArgs<ExtArgs>>): Prisma__word_status_changeClient<$Result.GetResult<Prisma.$word_status_changePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Word_status_changes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {word_status_changeCountArgs} args - Arguments to filter Word_status_changes to count.
     * @example
     * // Count the number of Word_status_changes
     * const count = await prisma.word_status_change.count({
     *   where: {
     *     // ... the filter for the Word_status_changes we want to count
     *   }
     * })
    **/
    count<T extends word_status_changeCountArgs>(
      args?: Subset<T, word_status_changeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Word_status_changeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Word_status_change.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Word_status_changeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Word_status_changeAggregateArgs>(args: Subset<T, Word_status_changeAggregateArgs>): Prisma.PrismaPromise<GetWord_status_changeAggregateType<T>>

    /**
     * Group by Word_status_change.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {word_status_changeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends word_status_changeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: word_status_changeGroupByArgs['orderBy'] }
        : { orderBy?: word_status_changeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, word_status_changeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWord_status_changeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the word_status_change model
   */
  readonly fields: word_status_changeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for word_status_change.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__word_status_changeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the word_status_change model
   */
  interface word_status_changeFieldRefs {
    readonly id: FieldRef<"word_status_change", 'BigInt'>
    readonly word_id: FieldRef<"word_status_change", 'BigInt'>
    readonly status: FieldRef<"word_status_change", 'String'>
    readonly info: FieldRef<"word_status_change", 'Json'>
    readonly comment: FieldRef<"word_status_change", 'String'>
    readonly create_time: FieldRef<"word_status_change", 'DateTime'>
    readonly update_time: FieldRef<"word_status_change", 'DateTime'>
    readonly is_delete: FieldRef<"word_status_change", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * word_status_change findUnique
   */
  export type word_status_changeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the word_status_change
     */
    select?: word_status_changeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the word_status_change
     */
    omit?: word_status_changeOmit<ExtArgs> | null
    /**
     * Filter, which word_status_change to fetch.
     */
    where: word_status_changeWhereUniqueInput
  }

  /**
   * word_status_change findUniqueOrThrow
   */
  export type word_status_changeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the word_status_change
     */
    select?: word_status_changeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the word_status_change
     */
    omit?: word_status_changeOmit<ExtArgs> | null
    /**
     * Filter, which word_status_change to fetch.
     */
    where: word_status_changeWhereUniqueInput
  }

  /**
   * word_status_change findFirst
   */
  export type word_status_changeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the word_status_change
     */
    select?: word_status_changeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the word_status_change
     */
    omit?: word_status_changeOmit<ExtArgs> | null
    /**
     * Filter, which word_status_change to fetch.
     */
    where?: word_status_changeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of word_status_changes to fetch.
     */
    orderBy?: word_status_changeOrderByWithRelationInput | word_status_changeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for word_status_changes.
     */
    cursor?: word_status_changeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` word_status_changes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` word_status_changes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of word_status_changes.
     */
    distinct?: Word_status_changeScalarFieldEnum | Word_status_changeScalarFieldEnum[]
  }

  /**
   * word_status_change findFirstOrThrow
   */
  export type word_status_changeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the word_status_change
     */
    select?: word_status_changeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the word_status_change
     */
    omit?: word_status_changeOmit<ExtArgs> | null
    /**
     * Filter, which word_status_change to fetch.
     */
    where?: word_status_changeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of word_status_changes to fetch.
     */
    orderBy?: word_status_changeOrderByWithRelationInput | word_status_changeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for word_status_changes.
     */
    cursor?: word_status_changeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` word_status_changes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` word_status_changes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of word_status_changes.
     */
    distinct?: Word_status_changeScalarFieldEnum | Word_status_changeScalarFieldEnum[]
  }

  /**
   * word_status_change findMany
   */
  export type word_status_changeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the word_status_change
     */
    select?: word_status_changeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the word_status_change
     */
    omit?: word_status_changeOmit<ExtArgs> | null
    /**
     * Filter, which word_status_changes to fetch.
     */
    where?: word_status_changeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of word_status_changes to fetch.
     */
    orderBy?: word_status_changeOrderByWithRelationInput | word_status_changeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing word_status_changes.
     */
    cursor?: word_status_changeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` word_status_changes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` word_status_changes.
     */
    skip?: number
    distinct?: Word_status_changeScalarFieldEnum | Word_status_changeScalarFieldEnum[]
  }

  /**
   * word_status_change create
   */
  export type word_status_changeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the word_status_change
     */
    select?: word_status_changeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the word_status_change
     */
    omit?: word_status_changeOmit<ExtArgs> | null
    /**
     * The data needed to create a word_status_change.
     */
    data: XOR<word_status_changeCreateInput, word_status_changeUncheckedCreateInput>
  }

  /**
   * word_status_change createMany
   */
  export type word_status_changeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many word_status_changes.
     */
    data: word_status_changeCreateManyInput | word_status_changeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * word_status_change update
   */
  export type word_status_changeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the word_status_change
     */
    select?: word_status_changeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the word_status_change
     */
    omit?: word_status_changeOmit<ExtArgs> | null
    /**
     * The data needed to update a word_status_change.
     */
    data: XOR<word_status_changeUpdateInput, word_status_changeUncheckedUpdateInput>
    /**
     * Choose, which word_status_change to update.
     */
    where: word_status_changeWhereUniqueInput
  }

  /**
   * word_status_change updateMany
   */
  export type word_status_changeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update word_status_changes.
     */
    data: XOR<word_status_changeUpdateManyMutationInput, word_status_changeUncheckedUpdateManyInput>
    /**
     * Filter which word_status_changes to update
     */
    where?: word_status_changeWhereInput
    /**
     * Limit how many word_status_changes to update.
     */
    limit?: number
  }

  /**
   * word_status_change upsert
   */
  export type word_status_changeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the word_status_change
     */
    select?: word_status_changeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the word_status_change
     */
    omit?: word_status_changeOmit<ExtArgs> | null
    /**
     * The filter to search for the word_status_change to update in case it exists.
     */
    where: word_status_changeWhereUniqueInput
    /**
     * In case the word_status_change found by the `where` argument doesn't exist, create a new word_status_change with this data.
     */
    create: XOR<word_status_changeCreateInput, word_status_changeUncheckedCreateInput>
    /**
     * In case the word_status_change was found with the provided `where` argument, update it with this data.
     */
    update: XOR<word_status_changeUpdateInput, word_status_changeUncheckedUpdateInput>
  }

  /**
   * word_status_change delete
   */
  export type word_status_changeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the word_status_change
     */
    select?: word_status_changeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the word_status_change
     */
    omit?: word_status_changeOmit<ExtArgs> | null
    /**
     * Filter which word_status_change to delete.
     */
    where: word_status_changeWhereUniqueInput
  }

  /**
   * word_status_change deleteMany
   */
  export type word_status_changeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which word_status_changes to delete
     */
    where?: word_status_changeWhereInput
    /**
     * Limit how many word_status_changes to delete.
     */
    limit?: number
  }

  /**
   * word_status_change without action
   */
  export type word_status_changeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the word_status_change
     */
    select?: word_status_changeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the word_status_change
     */
    omit?: word_status_changeOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const Audio_fileScalarFieldEnum: {
    id: 'id',
    path: 'path',
    content: 'content',
    creator_id: 'creator_id',
    create_time: 'create_time',
    update_time: 'update_time',
    is_delete: 'is_delete',
    status: 'status',
    name: 'name'
  };

  export type Audio_fileScalarFieldEnum = (typeof Audio_fileScalarFieldEnum)[keyof typeof Audio_fileScalarFieldEnum]


  export const CategoryScalarFieldEnum: {
    id: 'id',
    parent_id: 'parent_id',
    name: 'name',
    sort_order: 'sort_order',
    description: 'description',
    is_root: 'is_root',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum]


  export const Dictionary_categoryScalarFieldEnum: {
    id: 'id',
    dictionary_id: 'dictionary_id',
    category_id: 'category_id',
    sort_order: 'sort_order',
    created_at: 'created_at'
  };

  export type Dictionary_categoryScalarFieldEnum = (typeof Dictionary_categoryScalarFieldEnum)[keyof typeof Dictionary_categoryScalarFieldEnum]


  export const Dictionary_wordScalarFieldEnum: {
    dictionary_id: 'dictionary_id',
    word_id: 'word_id',
    created_at: 'created_at',
    id: 'id'
  };

  export type Dictionary_wordScalarFieldEnum = (typeof Dictionary_wordScalarFieldEnum)[keyof typeof Dictionary_wordScalarFieldEnum]


  export const English_dictionaryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    image_url: 'image_url',
    author: 'author',
    isbn: 'isbn',
    publication_date: 'publication_date',
    publisher: 'publisher',
    create_time: 'create_time',
    update_time: 'update_time',
    is_delete: 'is_delete',
    total_words: 'total_words',
    published_words: 'published_words',
    approved_words: 'approved_words'
  };

  export type English_dictionaryScalarFieldEnum = (typeof English_dictionaryScalarFieldEnum)[keyof typeof English_dictionaryScalarFieldEnum]


  export const English_wordScalarFieldEnum: {
    id: 'id',
    word_head: 'word_head',
    thumbnail: 'thumbnail',
    info: 'info',
    create_time: 'create_time',
    update_time: 'update_time',
    is_delete: 'is_delete',
    status: 'status',
    manual_score: 'manual_score',
    ai_score: 'ai_score',
    reviewer: 'reviewer'
  };

  export type English_wordScalarFieldEnum = (typeof English_wordScalarFieldEnum)[keyof typeof English_wordScalarFieldEnum]


  export const English_word_change_logScalarFieldEnum: {
    id: 'id',
    english_word_id: 'english_word_id',
    field_name: 'field_name',
    old_value: 'old_value',
    new_value: 'new_value',
    change_time: 'change_time',
    changed_by: 'changed_by'
  };

  export type English_word_change_logScalarFieldEnum = (typeof English_word_change_logScalarFieldEnum)[keyof typeof English_word_change_logScalarFieldEnum]


  export const Media_creatorScalarFieldEnum: {
    id: 'id',
    word_id: 'word_id',
    media_type: 'media_type',
    media_url: 'media_url',
    creator_id: 'creator_id',
    info: 'info',
    created_at: 'created_at'
  };

  export type Media_creatorScalarFieldEnum = (typeof Media_creatorScalarFieldEnum)[keyof typeof Media_creatorScalarFieldEnum]


  export const PostScalarFieldEnum: {
    id: 'id',
    title: 'title',
    content: 'content',
    tags: 'tags',
    thumbNum: 'thumbNum',
    favourNum: 'favourNum',
    userId: 'userId',
    createTime: 'createTime',
    updateTime: 'updateTime',
    isDelete: 'isDelete'
  };

  export type PostScalarFieldEnum = (typeof PostScalarFieldEnum)[keyof typeof PostScalarFieldEnum]


  export const Post_favourScalarFieldEnum: {
    id: 'id',
    postId: 'postId',
    userId: 'userId',
    createTime: 'createTime',
    updateTime: 'updateTime'
  };

  export type Post_favourScalarFieldEnum = (typeof Post_favourScalarFieldEnum)[keyof typeof Post_favourScalarFieldEnum]


  export const Post_thumbScalarFieldEnum: {
    id: 'id',
    postId: 'postId',
    userId: 'userId',
    createTime: 'createTime',
    updateTime: 'updateTime'
  };

  export type Post_thumbScalarFieldEnum = (typeof Post_thumbScalarFieldEnum)[keyof typeof Post_thumbScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    userAccount: 'userAccount',
    userPassword: 'userPassword',
    unionId: 'unionId',
    mpOpenId: 'mpOpenId',
    userName: 'userName',
    userAvatar: 'userAvatar',
    userProfile: 'userProfile',
    userRole: 'userRole',
    createTime: 'createTime',
    updateTime: 'updateTime',
    isDelete: 'isDelete'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const User_configScalarFieldEnum: {
    user_id: 'user_id',
    config_json: 'config_json',
    update_time: 'update_time'
  };

  export type User_configScalarFieldEnum = (typeof User_configScalarFieldEnum)[keyof typeof User_configScalarFieldEnum]


  export const Word_status_changeScalarFieldEnum: {
    id: 'id',
    word_id: 'word_id',
    status: 'status',
    info: 'info',
    comment: 'comment',
    create_time: 'create_time',
    update_time: 'update_time',
    is_delete: 'is_delete'
  };

  export type Word_status_changeScalarFieldEnum = (typeof Word_status_changeScalarFieldEnum)[keyof typeof Word_status_changeScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const audio_fileOrderByRelevanceFieldEnum: {
    path: 'path',
    content: 'content',
    status: 'status',
    name: 'name'
  };

  export type audio_fileOrderByRelevanceFieldEnum = (typeof audio_fileOrderByRelevanceFieldEnum)[keyof typeof audio_fileOrderByRelevanceFieldEnum]


  export const categoryOrderByRelevanceFieldEnum: {
    name: 'name',
    description: 'description'
  };

  export type categoryOrderByRelevanceFieldEnum = (typeof categoryOrderByRelevanceFieldEnum)[keyof typeof categoryOrderByRelevanceFieldEnum]


  export const english_dictionaryOrderByRelevanceFieldEnum: {
    name: 'name',
    description: 'description',
    image_url: 'image_url',
    author: 'author',
    isbn: 'isbn',
    publisher: 'publisher'
  };

  export type english_dictionaryOrderByRelevanceFieldEnum = (typeof english_dictionaryOrderByRelevanceFieldEnum)[keyof typeof english_dictionaryOrderByRelevanceFieldEnum]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const english_wordOrderByRelevanceFieldEnum: {
    word_head: 'word_head',
    thumbnail: 'thumbnail',
    status: 'status'
  };

  export type english_wordOrderByRelevanceFieldEnum = (typeof english_wordOrderByRelevanceFieldEnum)[keyof typeof english_wordOrderByRelevanceFieldEnum]


  export const english_word_change_logOrderByRelevanceFieldEnum: {
    field_name: 'field_name',
    old_value: 'old_value',
    new_value: 'new_value'
  };

  export type english_word_change_logOrderByRelevanceFieldEnum = (typeof english_word_change_logOrderByRelevanceFieldEnum)[keyof typeof english_word_change_logOrderByRelevanceFieldEnum]


  export const media_creatorOrderByRelevanceFieldEnum: {
    media_type: 'media_type',
    media_url: 'media_url',
    info: 'info'
  };

  export type media_creatorOrderByRelevanceFieldEnum = (typeof media_creatorOrderByRelevanceFieldEnum)[keyof typeof media_creatorOrderByRelevanceFieldEnum]


  export const postOrderByRelevanceFieldEnum: {
    title: 'title',
    content: 'content',
    tags: 'tags'
  };

  export type postOrderByRelevanceFieldEnum = (typeof postOrderByRelevanceFieldEnum)[keyof typeof postOrderByRelevanceFieldEnum]


  export const userOrderByRelevanceFieldEnum: {
    userAccount: 'userAccount',
    userPassword: 'userPassword',
    unionId: 'unionId',
    mpOpenId: 'mpOpenId',
    userName: 'userName',
    userAvatar: 'userAvatar',
    userProfile: 'userProfile',
    userRole: 'userRole'
  };

  export type userOrderByRelevanceFieldEnum = (typeof userOrderByRelevanceFieldEnum)[keyof typeof userOrderByRelevanceFieldEnum]


  export const word_status_changeOrderByRelevanceFieldEnum: {
    status: 'status',
    comment: 'comment'
  };

  export type word_status_changeOrderByRelevanceFieldEnum = (typeof word_status_changeOrderByRelevanceFieldEnum)[keyof typeof word_status_changeOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type audio_fileWhereInput = {
    AND?: audio_fileWhereInput | audio_fileWhereInput[]
    OR?: audio_fileWhereInput[]
    NOT?: audio_fileWhereInput | audio_fileWhereInput[]
    id?: BigIntFilter<"audio_file"> | bigint | number
    path?: StringNullableFilter<"audio_file"> | string | null
    content?: StringNullableFilter<"audio_file"> | string | null
    creator_id?: BigIntNullableFilter<"audio_file"> | bigint | number | null
    create_time?: DateTimeNullableFilter<"audio_file"> | Date | string | null
    update_time?: DateTimeNullableFilter<"audio_file"> | Date | string | null
    is_delete?: IntNullableFilter<"audio_file"> | number | null
    status?: StringFilter<"audio_file"> | string
    name?: StringFilter<"audio_file"> | string
    user?: XOR<UserNullableScalarRelationFilter, userWhereInput> | null
  }

  export type audio_fileOrderByWithRelationInput = {
    id?: SortOrder
    path?: SortOrderInput | SortOrder
    content?: SortOrderInput | SortOrder
    creator_id?: SortOrderInput | SortOrder
    create_time?: SortOrderInput | SortOrder
    update_time?: SortOrderInput | SortOrder
    is_delete?: SortOrderInput | SortOrder
    status?: SortOrder
    name?: SortOrder
    user?: userOrderByWithRelationInput
    _relevance?: audio_fileOrderByRelevanceInput
  }

  export type audio_fileWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: audio_fileWhereInput | audio_fileWhereInput[]
    OR?: audio_fileWhereInput[]
    NOT?: audio_fileWhereInput | audio_fileWhereInput[]
    path?: StringNullableFilter<"audio_file"> | string | null
    content?: StringNullableFilter<"audio_file"> | string | null
    creator_id?: BigIntNullableFilter<"audio_file"> | bigint | number | null
    create_time?: DateTimeNullableFilter<"audio_file"> | Date | string | null
    update_time?: DateTimeNullableFilter<"audio_file"> | Date | string | null
    is_delete?: IntNullableFilter<"audio_file"> | number | null
    status?: StringFilter<"audio_file"> | string
    name?: StringFilter<"audio_file"> | string
    user?: XOR<UserNullableScalarRelationFilter, userWhereInput> | null
  }, "id">

  export type audio_fileOrderByWithAggregationInput = {
    id?: SortOrder
    path?: SortOrderInput | SortOrder
    content?: SortOrderInput | SortOrder
    creator_id?: SortOrderInput | SortOrder
    create_time?: SortOrderInput | SortOrder
    update_time?: SortOrderInput | SortOrder
    is_delete?: SortOrderInput | SortOrder
    status?: SortOrder
    name?: SortOrder
    _count?: audio_fileCountOrderByAggregateInput
    _avg?: audio_fileAvgOrderByAggregateInput
    _max?: audio_fileMaxOrderByAggregateInput
    _min?: audio_fileMinOrderByAggregateInput
    _sum?: audio_fileSumOrderByAggregateInput
  }

  export type audio_fileScalarWhereWithAggregatesInput = {
    AND?: audio_fileScalarWhereWithAggregatesInput | audio_fileScalarWhereWithAggregatesInput[]
    OR?: audio_fileScalarWhereWithAggregatesInput[]
    NOT?: audio_fileScalarWhereWithAggregatesInput | audio_fileScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"audio_file"> | bigint | number
    path?: StringNullableWithAggregatesFilter<"audio_file"> | string | null
    content?: StringNullableWithAggregatesFilter<"audio_file"> | string | null
    creator_id?: BigIntNullableWithAggregatesFilter<"audio_file"> | bigint | number | null
    create_time?: DateTimeNullableWithAggregatesFilter<"audio_file"> | Date | string | null
    update_time?: DateTimeNullableWithAggregatesFilter<"audio_file"> | Date | string | null
    is_delete?: IntNullableWithAggregatesFilter<"audio_file"> | number | null
    status?: StringWithAggregatesFilter<"audio_file"> | string
    name?: StringWithAggregatesFilter<"audio_file"> | string
  }

  export type categoryWhereInput = {
    AND?: categoryWhereInput | categoryWhereInput[]
    OR?: categoryWhereInput[]
    NOT?: categoryWhereInput | categoryWhereInput[]
    id?: IntFilter<"category"> | number
    parent_id?: IntNullableFilter<"category"> | number | null
    name?: StringFilter<"category"> | string
    sort_order?: IntNullableFilter<"category"> | number | null
    description?: StringNullableFilter<"category"> | string | null
    is_root?: BoolNullableFilter<"category"> | boolean | null
    created_at?: DateTimeNullableFilter<"category"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"category"> | Date | string | null
  }

  export type categoryOrderByWithRelationInput = {
    id?: SortOrder
    parent_id?: SortOrderInput | SortOrder
    name?: SortOrder
    sort_order?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    is_root?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _relevance?: categoryOrderByRelevanceInput
  }

  export type categoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: categoryWhereInput | categoryWhereInput[]
    OR?: categoryWhereInput[]
    NOT?: categoryWhereInput | categoryWhereInput[]
    parent_id?: IntNullableFilter<"category"> | number | null
    name?: StringFilter<"category"> | string
    sort_order?: IntNullableFilter<"category"> | number | null
    description?: StringNullableFilter<"category"> | string | null
    is_root?: BoolNullableFilter<"category"> | boolean | null
    created_at?: DateTimeNullableFilter<"category"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"category"> | Date | string | null
  }, "id">

  export type categoryOrderByWithAggregationInput = {
    id?: SortOrder
    parent_id?: SortOrderInput | SortOrder
    name?: SortOrder
    sort_order?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    is_root?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: categoryCountOrderByAggregateInput
    _avg?: categoryAvgOrderByAggregateInput
    _max?: categoryMaxOrderByAggregateInput
    _min?: categoryMinOrderByAggregateInput
    _sum?: categorySumOrderByAggregateInput
  }

  export type categoryScalarWhereWithAggregatesInput = {
    AND?: categoryScalarWhereWithAggregatesInput | categoryScalarWhereWithAggregatesInput[]
    OR?: categoryScalarWhereWithAggregatesInput[]
    NOT?: categoryScalarWhereWithAggregatesInput | categoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"category"> | number
    parent_id?: IntNullableWithAggregatesFilter<"category"> | number | null
    name?: StringWithAggregatesFilter<"category"> | string
    sort_order?: IntNullableWithAggregatesFilter<"category"> | number | null
    description?: StringNullableWithAggregatesFilter<"category"> | string | null
    is_root?: BoolNullableWithAggregatesFilter<"category"> | boolean | null
    created_at?: DateTimeNullableWithAggregatesFilter<"category"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"category"> | Date | string | null
  }

  export type dictionary_categoryWhereInput = {
    AND?: dictionary_categoryWhereInput | dictionary_categoryWhereInput[]
    OR?: dictionary_categoryWhereInput[]
    NOT?: dictionary_categoryWhereInput | dictionary_categoryWhereInput[]
    id?: IntFilter<"dictionary_category"> | number
    dictionary_id?: BigIntFilter<"dictionary_category"> | bigint | number
    category_id?: IntFilter<"dictionary_category"> | number
    sort_order?: IntNullableFilter<"dictionary_category"> | number | null
    created_at?: DateTimeNullableFilter<"dictionary_category"> | Date | string | null
  }

  export type dictionary_categoryOrderByWithRelationInput = {
    id?: SortOrder
    dictionary_id?: SortOrder
    category_id?: SortOrder
    sort_order?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
  }

  export type dictionary_categoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: dictionary_categoryWhereInput | dictionary_categoryWhereInput[]
    OR?: dictionary_categoryWhereInput[]
    NOT?: dictionary_categoryWhereInput | dictionary_categoryWhereInput[]
    dictionary_id?: BigIntFilter<"dictionary_category"> | bigint | number
    category_id?: IntFilter<"dictionary_category"> | number
    sort_order?: IntNullableFilter<"dictionary_category"> | number | null
    created_at?: DateTimeNullableFilter<"dictionary_category"> | Date | string | null
  }, "id">

  export type dictionary_categoryOrderByWithAggregationInput = {
    id?: SortOrder
    dictionary_id?: SortOrder
    category_id?: SortOrder
    sort_order?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: dictionary_categoryCountOrderByAggregateInput
    _avg?: dictionary_categoryAvgOrderByAggregateInput
    _max?: dictionary_categoryMaxOrderByAggregateInput
    _min?: dictionary_categoryMinOrderByAggregateInput
    _sum?: dictionary_categorySumOrderByAggregateInput
  }

  export type dictionary_categoryScalarWhereWithAggregatesInput = {
    AND?: dictionary_categoryScalarWhereWithAggregatesInput | dictionary_categoryScalarWhereWithAggregatesInput[]
    OR?: dictionary_categoryScalarWhereWithAggregatesInput[]
    NOT?: dictionary_categoryScalarWhereWithAggregatesInput | dictionary_categoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"dictionary_category"> | number
    dictionary_id?: BigIntWithAggregatesFilter<"dictionary_category"> | bigint | number
    category_id?: IntWithAggregatesFilter<"dictionary_category"> | number
    sort_order?: IntNullableWithAggregatesFilter<"dictionary_category"> | number | null
    created_at?: DateTimeNullableWithAggregatesFilter<"dictionary_category"> | Date | string | null
  }

  export type dictionary_wordWhereInput = {
    AND?: dictionary_wordWhereInput | dictionary_wordWhereInput[]
    OR?: dictionary_wordWhereInput[]
    NOT?: dictionary_wordWhereInput | dictionary_wordWhereInput[]
    dictionary_id?: BigIntFilter<"dictionary_word"> | bigint | number
    word_id?: BigIntFilter<"dictionary_word"> | bigint | number
    created_at?: DateTimeNullableFilter<"dictionary_word"> | Date | string | null
    id?: BigIntNullableFilter<"dictionary_word"> | bigint | number | null
    english_dictionary?: XOR<English_dictionaryScalarRelationFilter, english_dictionaryWhereInput>
    english_word?: XOR<English_wordScalarRelationFilter, english_wordWhereInput>
  }

  export type dictionary_wordOrderByWithRelationInput = {
    dictionary_id?: SortOrder
    word_id?: SortOrder
    created_at?: SortOrderInput | SortOrder
    id?: SortOrderInput | SortOrder
    english_dictionary?: english_dictionaryOrderByWithRelationInput
    english_word?: english_wordOrderByWithRelationInput
  }

  export type dictionary_wordWhereUniqueInput = Prisma.AtLeast<{
    dictionary_id_word_id?: dictionary_wordDictionary_idWord_idCompoundUniqueInput
    AND?: dictionary_wordWhereInput | dictionary_wordWhereInput[]
    OR?: dictionary_wordWhereInput[]
    NOT?: dictionary_wordWhereInput | dictionary_wordWhereInput[]
    dictionary_id?: BigIntFilter<"dictionary_word"> | bigint | number
    word_id?: BigIntFilter<"dictionary_word"> | bigint | number
    created_at?: DateTimeNullableFilter<"dictionary_word"> | Date | string | null
    id?: BigIntNullableFilter<"dictionary_word"> | bigint | number | null
    english_dictionary?: XOR<English_dictionaryScalarRelationFilter, english_dictionaryWhereInput>
    english_word?: XOR<English_wordScalarRelationFilter, english_wordWhereInput>
  }, "dictionary_id_word_id">

  export type dictionary_wordOrderByWithAggregationInput = {
    dictionary_id?: SortOrder
    word_id?: SortOrder
    created_at?: SortOrderInput | SortOrder
    id?: SortOrderInput | SortOrder
    _count?: dictionary_wordCountOrderByAggregateInput
    _avg?: dictionary_wordAvgOrderByAggregateInput
    _max?: dictionary_wordMaxOrderByAggregateInput
    _min?: dictionary_wordMinOrderByAggregateInput
    _sum?: dictionary_wordSumOrderByAggregateInput
  }

  export type dictionary_wordScalarWhereWithAggregatesInput = {
    AND?: dictionary_wordScalarWhereWithAggregatesInput | dictionary_wordScalarWhereWithAggregatesInput[]
    OR?: dictionary_wordScalarWhereWithAggregatesInput[]
    NOT?: dictionary_wordScalarWhereWithAggregatesInput | dictionary_wordScalarWhereWithAggregatesInput[]
    dictionary_id?: BigIntWithAggregatesFilter<"dictionary_word"> | bigint | number
    word_id?: BigIntWithAggregatesFilter<"dictionary_word"> | bigint | number
    created_at?: DateTimeNullableWithAggregatesFilter<"dictionary_word"> | Date | string | null
    id?: BigIntNullableWithAggregatesFilter<"dictionary_word"> | bigint | number | null
  }

  export type english_dictionaryWhereInput = {
    AND?: english_dictionaryWhereInput | english_dictionaryWhereInput[]
    OR?: english_dictionaryWhereInput[]
    NOT?: english_dictionaryWhereInput | english_dictionaryWhereInput[]
    id?: BigIntFilter<"english_dictionary"> | bigint | number
    name?: StringNullableFilter<"english_dictionary"> | string | null
    description?: StringNullableFilter<"english_dictionary"> | string | null
    image_url?: StringNullableFilter<"english_dictionary"> | string | null
    author?: StringNullableFilter<"english_dictionary"> | string | null
    isbn?: StringNullableFilter<"english_dictionary"> | string | null
    publication_date?: DateTimeNullableFilter<"english_dictionary"> | Date | string | null
    publisher?: StringNullableFilter<"english_dictionary"> | string | null
    create_time?: DateTimeNullableFilter<"english_dictionary"> | Date | string | null
    update_time?: DateTimeNullableFilter<"english_dictionary"> | Date | string | null
    is_delete?: BoolNullableFilter<"english_dictionary"> | boolean | null
    total_words?: IntNullableFilter<"english_dictionary"> | number | null
    published_words?: IntNullableFilter<"english_dictionary"> | number | null
    approved_words?: IntNullableFilter<"english_dictionary"> | number | null
    dictionary_word?: Dictionary_wordListRelationFilter
  }

  export type english_dictionaryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    image_url?: SortOrderInput | SortOrder
    author?: SortOrderInput | SortOrder
    isbn?: SortOrderInput | SortOrder
    publication_date?: SortOrderInput | SortOrder
    publisher?: SortOrderInput | SortOrder
    create_time?: SortOrderInput | SortOrder
    update_time?: SortOrderInput | SortOrder
    is_delete?: SortOrderInput | SortOrder
    total_words?: SortOrderInput | SortOrder
    published_words?: SortOrderInput | SortOrder
    approved_words?: SortOrderInput | SortOrder
    dictionary_word?: dictionary_wordOrderByRelationAggregateInput
    _relevance?: english_dictionaryOrderByRelevanceInput
  }

  export type english_dictionaryWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: english_dictionaryWhereInput | english_dictionaryWhereInput[]
    OR?: english_dictionaryWhereInput[]
    NOT?: english_dictionaryWhereInput | english_dictionaryWhereInput[]
    name?: StringNullableFilter<"english_dictionary"> | string | null
    description?: StringNullableFilter<"english_dictionary"> | string | null
    image_url?: StringNullableFilter<"english_dictionary"> | string | null
    author?: StringNullableFilter<"english_dictionary"> | string | null
    isbn?: StringNullableFilter<"english_dictionary"> | string | null
    publication_date?: DateTimeNullableFilter<"english_dictionary"> | Date | string | null
    publisher?: StringNullableFilter<"english_dictionary"> | string | null
    create_time?: DateTimeNullableFilter<"english_dictionary"> | Date | string | null
    update_time?: DateTimeNullableFilter<"english_dictionary"> | Date | string | null
    is_delete?: BoolNullableFilter<"english_dictionary"> | boolean | null
    total_words?: IntNullableFilter<"english_dictionary"> | number | null
    published_words?: IntNullableFilter<"english_dictionary"> | number | null
    approved_words?: IntNullableFilter<"english_dictionary"> | number | null
    dictionary_word?: Dictionary_wordListRelationFilter
  }, "id">

  export type english_dictionaryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    image_url?: SortOrderInput | SortOrder
    author?: SortOrderInput | SortOrder
    isbn?: SortOrderInput | SortOrder
    publication_date?: SortOrderInput | SortOrder
    publisher?: SortOrderInput | SortOrder
    create_time?: SortOrderInput | SortOrder
    update_time?: SortOrderInput | SortOrder
    is_delete?: SortOrderInput | SortOrder
    total_words?: SortOrderInput | SortOrder
    published_words?: SortOrderInput | SortOrder
    approved_words?: SortOrderInput | SortOrder
    _count?: english_dictionaryCountOrderByAggregateInput
    _avg?: english_dictionaryAvgOrderByAggregateInput
    _max?: english_dictionaryMaxOrderByAggregateInput
    _min?: english_dictionaryMinOrderByAggregateInput
    _sum?: english_dictionarySumOrderByAggregateInput
  }

  export type english_dictionaryScalarWhereWithAggregatesInput = {
    AND?: english_dictionaryScalarWhereWithAggregatesInput | english_dictionaryScalarWhereWithAggregatesInput[]
    OR?: english_dictionaryScalarWhereWithAggregatesInput[]
    NOT?: english_dictionaryScalarWhereWithAggregatesInput | english_dictionaryScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"english_dictionary"> | bigint | number
    name?: StringNullableWithAggregatesFilter<"english_dictionary"> | string | null
    description?: StringNullableWithAggregatesFilter<"english_dictionary"> | string | null
    image_url?: StringNullableWithAggregatesFilter<"english_dictionary"> | string | null
    author?: StringNullableWithAggregatesFilter<"english_dictionary"> | string | null
    isbn?: StringNullableWithAggregatesFilter<"english_dictionary"> | string | null
    publication_date?: DateTimeNullableWithAggregatesFilter<"english_dictionary"> | Date | string | null
    publisher?: StringNullableWithAggregatesFilter<"english_dictionary"> | string | null
    create_time?: DateTimeNullableWithAggregatesFilter<"english_dictionary"> | Date | string | null
    update_time?: DateTimeNullableWithAggregatesFilter<"english_dictionary"> | Date | string | null
    is_delete?: BoolNullableWithAggregatesFilter<"english_dictionary"> | boolean | null
    total_words?: IntNullableWithAggregatesFilter<"english_dictionary"> | number | null
    published_words?: IntNullableWithAggregatesFilter<"english_dictionary"> | number | null
    approved_words?: IntNullableWithAggregatesFilter<"english_dictionary"> | number | null
  }

  export type english_wordWhereInput = {
    AND?: english_wordWhereInput | english_wordWhereInput[]
    OR?: english_wordWhereInput[]
    NOT?: english_wordWhereInput | english_wordWhereInput[]
    id?: BigIntFilter<"english_word"> | bigint | number
    word_head?: StringNullableFilter<"english_word"> | string | null
    thumbnail?: StringNullableFilter<"english_word"> | string | null
    info?: JsonNullableFilter<"english_word">
    create_time?: DateTimeNullableFilter<"english_word"> | Date | string | null
    update_time?: DateTimeNullableFilter<"english_word"> | Date | string | null
    is_delete?: BoolNullableFilter<"english_word"> | boolean | null
    status?: StringNullableFilter<"english_word"> | string | null
    manual_score?: IntNullableFilter<"english_word"> | number | null
    ai_score?: IntNullableFilter<"english_word"> | number | null
    reviewer?: BigIntNullableFilter<"english_word"> | bigint | number | null
    dictionary_word?: Dictionary_wordListRelationFilter
    english_word_change_log?: English_word_change_logListRelationFilter
    media_creator?: Media_creatorListRelationFilter
  }

  export type english_wordOrderByWithRelationInput = {
    id?: SortOrder
    word_head?: SortOrderInput | SortOrder
    thumbnail?: SortOrderInput | SortOrder
    info?: SortOrderInput | SortOrder
    create_time?: SortOrderInput | SortOrder
    update_time?: SortOrderInput | SortOrder
    is_delete?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    manual_score?: SortOrderInput | SortOrder
    ai_score?: SortOrderInput | SortOrder
    reviewer?: SortOrderInput | SortOrder
    dictionary_word?: dictionary_wordOrderByRelationAggregateInput
    english_word_change_log?: english_word_change_logOrderByRelationAggregateInput
    media_creator?: media_creatorOrderByRelationAggregateInput
    _relevance?: english_wordOrderByRelevanceInput
  }

  export type english_wordWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: english_wordWhereInput | english_wordWhereInput[]
    OR?: english_wordWhereInput[]
    NOT?: english_wordWhereInput | english_wordWhereInput[]
    word_head?: StringNullableFilter<"english_word"> | string | null
    thumbnail?: StringNullableFilter<"english_word"> | string | null
    info?: JsonNullableFilter<"english_word">
    create_time?: DateTimeNullableFilter<"english_word"> | Date | string | null
    update_time?: DateTimeNullableFilter<"english_word"> | Date | string | null
    is_delete?: BoolNullableFilter<"english_word"> | boolean | null
    status?: StringNullableFilter<"english_word"> | string | null
    manual_score?: IntNullableFilter<"english_word"> | number | null
    ai_score?: IntNullableFilter<"english_word"> | number | null
    reviewer?: BigIntNullableFilter<"english_word"> | bigint | number | null
    dictionary_word?: Dictionary_wordListRelationFilter
    english_word_change_log?: English_word_change_logListRelationFilter
    media_creator?: Media_creatorListRelationFilter
  }, "id">

  export type english_wordOrderByWithAggregationInput = {
    id?: SortOrder
    word_head?: SortOrderInput | SortOrder
    thumbnail?: SortOrderInput | SortOrder
    info?: SortOrderInput | SortOrder
    create_time?: SortOrderInput | SortOrder
    update_time?: SortOrderInput | SortOrder
    is_delete?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    manual_score?: SortOrderInput | SortOrder
    ai_score?: SortOrderInput | SortOrder
    reviewer?: SortOrderInput | SortOrder
    _count?: english_wordCountOrderByAggregateInput
    _avg?: english_wordAvgOrderByAggregateInput
    _max?: english_wordMaxOrderByAggregateInput
    _min?: english_wordMinOrderByAggregateInput
    _sum?: english_wordSumOrderByAggregateInput
  }

  export type english_wordScalarWhereWithAggregatesInput = {
    AND?: english_wordScalarWhereWithAggregatesInput | english_wordScalarWhereWithAggregatesInput[]
    OR?: english_wordScalarWhereWithAggregatesInput[]
    NOT?: english_wordScalarWhereWithAggregatesInput | english_wordScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"english_word"> | bigint | number
    word_head?: StringNullableWithAggregatesFilter<"english_word"> | string | null
    thumbnail?: StringNullableWithAggregatesFilter<"english_word"> | string | null
    info?: JsonNullableWithAggregatesFilter<"english_word">
    create_time?: DateTimeNullableWithAggregatesFilter<"english_word"> | Date | string | null
    update_time?: DateTimeNullableWithAggregatesFilter<"english_word"> | Date | string | null
    is_delete?: BoolNullableWithAggregatesFilter<"english_word"> | boolean | null
    status?: StringNullableWithAggregatesFilter<"english_word"> | string | null
    manual_score?: IntNullableWithAggregatesFilter<"english_word"> | number | null
    ai_score?: IntNullableWithAggregatesFilter<"english_word"> | number | null
    reviewer?: BigIntNullableWithAggregatesFilter<"english_word"> | bigint | number | null
  }

  export type english_word_change_logWhereInput = {
    AND?: english_word_change_logWhereInput | english_word_change_logWhereInput[]
    OR?: english_word_change_logWhereInput[]
    NOT?: english_word_change_logWhereInput | english_word_change_logWhereInput[]
    id?: BigIntFilter<"english_word_change_log"> | bigint | number
    english_word_id?: BigIntFilter<"english_word_change_log"> | bigint | number
    field_name?: StringFilter<"english_word_change_log"> | string
    old_value?: StringNullableFilter<"english_word_change_log"> | string | null
    new_value?: StringNullableFilter<"english_word_change_log"> | string | null
    change_time?: DateTimeFilter<"english_word_change_log"> | Date | string
    changed_by?: BigIntNullableFilter<"english_word_change_log"> | bigint | number | null
    english_word?: XOR<English_wordScalarRelationFilter, english_wordWhereInput>
  }

  export type english_word_change_logOrderByWithRelationInput = {
    id?: SortOrder
    english_word_id?: SortOrder
    field_name?: SortOrder
    old_value?: SortOrderInput | SortOrder
    new_value?: SortOrderInput | SortOrder
    change_time?: SortOrder
    changed_by?: SortOrderInput | SortOrder
    english_word?: english_wordOrderByWithRelationInput
    _relevance?: english_word_change_logOrderByRelevanceInput
  }

  export type english_word_change_logWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: english_word_change_logWhereInput | english_word_change_logWhereInput[]
    OR?: english_word_change_logWhereInput[]
    NOT?: english_word_change_logWhereInput | english_word_change_logWhereInput[]
    english_word_id?: BigIntFilter<"english_word_change_log"> | bigint | number
    field_name?: StringFilter<"english_word_change_log"> | string
    old_value?: StringNullableFilter<"english_word_change_log"> | string | null
    new_value?: StringNullableFilter<"english_word_change_log"> | string | null
    change_time?: DateTimeFilter<"english_word_change_log"> | Date | string
    changed_by?: BigIntNullableFilter<"english_word_change_log"> | bigint | number | null
    english_word?: XOR<English_wordScalarRelationFilter, english_wordWhereInput>
  }, "id">

  export type english_word_change_logOrderByWithAggregationInput = {
    id?: SortOrder
    english_word_id?: SortOrder
    field_name?: SortOrder
    old_value?: SortOrderInput | SortOrder
    new_value?: SortOrderInput | SortOrder
    change_time?: SortOrder
    changed_by?: SortOrderInput | SortOrder
    _count?: english_word_change_logCountOrderByAggregateInput
    _avg?: english_word_change_logAvgOrderByAggregateInput
    _max?: english_word_change_logMaxOrderByAggregateInput
    _min?: english_word_change_logMinOrderByAggregateInput
    _sum?: english_word_change_logSumOrderByAggregateInput
  }

  export type english_word_change_logScalarWhereWithAggregatesInput = {
    AND?: english_word_change_logScalarWhereWithAggregatesInput | english_word_change_logScalarWhereWithAggregatesInput[]
    OR?: english_word_change_logScalarWhereWithAggregatesInput[]
    NOT?: english_word_change_logScalarWhereWithAggregatesInput | english_word_change_logScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"english_word_change_log"> | bigint | number
    english_word_id?: BigIntWithAggregatesFilter<"english_word_change_log"> | bigint | number
    field_name?: StringWithAggregatesFilter<"english_word_change_log"> | string
    old_value?: StringNullableWithAggregatesFilter<"english_word_change_log"> | string | null
    new_value?: StringNullableWithAggregatesFilter<"english_word_change_log"> | string | null
    change_time?: DateTimeWithAggregatesFilter<"english_word_change_log"> | Date | string
    changed_by?: BigIntNullableWithAggregatesFilter<"english_word_change_log"> | bigint | number | null
  }

  export type media_creatorWhereInput = {
    AND?: media_creatorWhereInput | media_creatorWhereInput[]
    OR?: media_creatorWhereInput[]
    NOT?: media_creatorWhereInput | media_creatorWhereInput[]
    id?: BigIntFilter<"media_creator"> | bigint | number
    word_id?: BigIntFilter<"media_creator"> | bigint | number
    media_type?: StringFilter<"media_creator"> | string
    media_url?: StringNullableFilter<"media_creator"> | string | null
    creator_id?: BigIntNullableFilter<"media_creator"> | bigint | number | null
    info?: StringNullableFilter<"media_creator"> | string | null
    created_at?: DateTimeNullableFilter<"media_creator"> | Date | string | null
    english_word?: XOR<English_wordScalarRelationFilter, english_wordWhereInput>
  }

  export type media_creatorOrderByWithRelationInput = {
    id?: SortOrder
    word_id?: SortOrder
    media_type?: SortOrder
    media_url?: SortOrderInput | SortOrder
    creator_id?: SortOrderInput | SortOrder
    info?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    english_word?: english_wordOrderByWithRelationInput
    _relevance?: media_creatorOrderByRelevanceInput
  }

  export type media_creatorWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: media_creatorWhereInput | media_creatorWhereInput[]
    OR?: media_creatorWhereInput[]
    NOT?: media_creatorWhereInput | media_creatorWhereInput[]
    word_id?: BigIntFilter<"media_creator"> | bigint | number
    media_type?: StringFilter<"media_creator"> | string
    media_url?: StringNullableFilter<"media_creator"> | string | null
    creator_id?: BigIntNullableFilter<"media_creator"> | bigint | number | null
    info?: StringNullableFilter<"media_creator"> | string | null
    created_at?: DateTimeNullableFilter<"media_creator"> | Date | string | null
    english_word?: XOR<English_wordScalarRelationFilter, english_wordWhereInput>
  }, "id">

  export type media_creatorOrderByWithAggregationInput = {
    id?: SortOrder
    word_id?: SortOrder
    media_type?: SortOrder
    media_url?: SortOrderInput | SortOrder
    creator_id?: SortOrderInput | SortOrder
    info?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: media_creatorCountOrderByAggregateInput
    _avg?: media_creatorAvgOrderByAggregateInput
    _max?: media_creatorMaxOrderByAggregateInput
    _min?: media_creatorMinOrderByAggregateInput
    _sum?: media_creatorSumOrderByAggregateInput
  }

  export type media_creatorScalarWhereWithAggregatesInput = {
    AND?: media_creatorScalarWhereWithAggregatesInput | media_creatorScalarWhereWithAggregatesInput[]
    OR?: media_creatorScalarWhereWithAggregatesInput[]
    NOT?: media_creatorScalarWhereWithAggregatesInput | media_creatorScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"media_creator"> | bigint | number
    word_id?: BigIntWithAggregatesFilter<"media_creator"> | bigint | number
    media_type?: StringWithAggregatesFilter<"media_creator"> | string
    media_url?: StringNullableWithAggregatesFilter<"media_creator"> | string | null
    creator_id?: BigIntNullableWithAggregatesFilter<"media_creator"> | bigint | number | null
    info?: StringNullableWithAggregatesFilter<"media_creator"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"media_creator"> | Date | string | null
  }

  export type postWhereInput = {
    AND?: postWhereInput | postWhereInput[]
    OR?: postWhereInput[]
    NOT?: postWhereInput | postWhereInput[]
    id?: BigIntFilter<"post"> | bigint | number
    title?: StringNullableFilter<"post"> | string | null
    content?: StringNullableFilter<"post"> | string | null
    tags?: StringNullableFilter<"post"> | string | null
    thumbNum?: IntFilter<"post"> | number
    favourNum?: IntFilter<"post"> | number
    userId?: BigIntFilter<"post"> | bigint | number
    createTime?: DateTimeFilter<"post"> | Date | string
    updateTime?: DateTimeFilter<"post"> | Date | string
    isDelete?: IntFilter<"post"> | number
  }

  export type postOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    content?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    thumbNum?: SortOrder
    favourNum?: SortOrder
    userId?: SortOrder
    createTime?: SortOrder
    updateTime?: SortOrder
    isDelete?: SortOrder
    _relevance?: postOrderByRelevanceInput
  }

  export type postWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: postWhereInput | postWhereInput[]
    OR?: postWhereInput[]
    NOT?: postWhereInput | postWhereInput[]
    title?: StringNullableFilter<"post"> | string | null
    content?: StringNullableFilter<"post"> | string | null
    tags?: StringNullableFilter<"post"> | string | null
    thumbNum?: IntFilter<"post"> | number
    favourNum?: IntFilter<"post"> | number
    userId?: BigIntFilter<"post"> | bigint | number
    createTime?: DateTimeFilter<"post"> | Date | string
    updateTime?: DateTimeFilter<"post"> | Date | string
    isDelete?: IntFilter<"post"> | number
  }, "id">

  export type postOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    content?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    thumbNum?: SortOrder
    favourNum?: SortOrder
    userId?: SortOrder
    createTime?: SortOrder
    updateTime?: SortOrder
    isDelete?: SortOrder
    _count?: postCountOrderByAggregateInput
    _avg?: postAvgOrderByAggregateInput
    _max?: postMaxOrderByAggregateInput
    _min?: postMinOrderByAggregateInput
    _sum?: postSumOrderByAggregateInput
  }

  export type postScalarWhereWithAggregatesInput = {
    AND?: postScalarWhereWithAggregatesInput | postScalarWhereWithAggregatesInput[]
    OR?: postScalarWhereWithAggregatesInput[]
    NOT?: postScalarWhereWithAggregatesInput | postScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"post"> | bigint | number
    title?: StringNullableWithAggregatesFilter<"post"> | string | null
    content?: StringNullableWithAggregatesFilter<"post"> | string | null
    tags?: StringNullableWithAggregatesFilter<"post"> | string | null
    thumbNum?: IntWithAggregatesFilter<"post"> | number
    favourNum?: IntWithAggregatesFilter<"post"> | number
    userId?: BigIntWithAggregatesFilter<"post"> | bigint | number
    createTime?: DateTimeWithAggregatesFilter<"post"> | Date | string
    updateTime?: DateTimeWithAggregatesFilter<"post"> | Date | string
    isDelete?: IntWithAggregatesFilter<"post"> | number
  }

  export type post_favourWhereInput = {
    AND?: post_favourWhereInput | post_favourWhereInput[]
    OR?: post_favourWhereInput[]
    NOT?: post_favourWhereInput | post_favourWhereInput[]
    id?: BigIntFilter<"post_favour"> | bigint | number
    postId?: BigIntFilter<"post_favour"> | bigint | number
    userId?: BigIntFilter<"post_favour"> | bigint | number
    createTime?: DateTimeFilter<"post_favour"> | Date | string
    updateTime?: DateTimeFilter<"post_favour"> | Date | string
  }

  export type post_favourOrderByWithRelationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createTime?: SortOrder
    updateTime?: SortOrder
  }

  export type post_favourWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: post_favourWhereInput | post_favourWhereInput[]
    OR?: post_favourWhereInput[]
    NOT?: post_favourWhereInput | post_favourWhereInput[]
    postId?: BigIntFilter<"post_favour"> | bigint | number
    userId?: BigIntFilter<"post_favour"> | bigint | number
    createTime?: DateTimeFilter<"post_favour"> | Date | string
    updateTime?: DateTimeFilter<"post_favour"> | Date | string
  }, "id">

  export type post_favourOrderByWithAggregationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createTime?: SortOrder
    updateTime?: SortOrder
    _count?: post_favourCountOrderByAggregateInput
    _avg?: post_favourAvgOrderByAggregateInput
    _max?: post_favourMaxOrderByAggregateInput
    _min?: post_favourMinOrderByAggregateInput
    _sum?: post_favourSumOrderByAggregateInput
  }

  export type post_favourScalarWhereWithAggregatesInput = {
    AND?: post_favourScalarWhereWithAggregatesInput | post_favourScalarWhereWithAggregatesInput[]
    OR?: post_favourScalarWhereWithAggregatesInput[]
    NOT?: post_favourScalarWhereWithAggregatesInput | post_favourScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"post_favour"> | bigint | number
    postId?: BigIntWithAggregatesFilter<"post_favour"> | bigint | number
    userId?: BigIntWithAggregatesFilter<"post_favour"> | bigint | number
    createTime?: DateTimeWithAggregatesFilter<"post_favour"> | Date | string
    updateTime?: DateTimeWithAggregatesFilter<"post_favour"> | Date | string
  }

  export type post_thumbWhereInput = {
    AND?: post_thumbWhereInput | post_thumbWhereInput[]
    OR?: post_thumbWhereInput[]
    NOT?: post_thumbWhereInput | post_thumbWhereInput[]
    id?: BigIntFilter<"post_thumb"> | bigint | number
    postId?: BigIntFilter<"post_thumb"> | bigint | number
    userId?: BigIntFilter<"post_thumb"> | bigint | number
    createTime?: DateTimeFilter<"post_thumb"> | Date | string
    updateTime?: DateTimeFilter<"post_thumb"> | Date | string
  }

  export type post_thumbOrderByWithRelationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createTime?: SortOrder
    updateTime?: SortOrder
  }

  export type post_thumbWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: post_thumbWhereInput | post_thumbWhereInput[]
    OR?: post_thumbWhereInput[]
    NOT?: post_thumbWhereInput | post_thumbWhereInput[]
    postId?: BigIntFilter<"post_thumb"> | bigint | number
    userId?: BigIntFilter<"post_thumb"> | bigint | number
    createTime?: DateTimeFilter<"post_thumb"> | Date | string
    updateTime?: DateTimeFilter<"post_thumb"> | Date | string
  }, "id">

  export type post_thumbOrderByWithAggregationInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createTime?: SortOrder
    updateTime?: SortOrder
    _count?: post_thumbCountOrderByAggregateInput
    _avg?: post_thumbAvgOrderByAggregateInput
    _max?: post_thumbMaxOrderByAggregateInput
    _min?: post_thumbMinOrderByAggregateInput
    _sum?: post_thumbSumOrderByAggregateInput
  }

  export type post_thumbScalarWhereWithAggregatesInput = {
    AND?: post_thumbScalarWhereWithAggregatesInput | post_thumbScalarWhereWithAggregatesInput[]
    OR?: post_thumbScalarWhereWithAggregatesInput[]
    NOT?: post_thumbScalarWhereWithAggregatesInput | post_thumbScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"post_thumb"> | bigint | number
    postId?: BigIntWithAggregatesFilter<"post_thumb"> | bigint | number
    userId?: BigIntWithAggregatesFilter<"post_thumb"> | bigint | number
    createTime?: DateTimeWithAggregatesFilter<"post_thumb"> | Date | string
    updateTime?: DateTimeWithAggregatesFilter<"post_thumb"> | Date | string
  }

  export type userWhereInput = {
    AND?: userWhereInput | userWhereInput[]
    OR?: userWhereInput[]
    NOT?: userWhereInput | userWhereInput[]
    id?: BigIntFilter<"user"> | bigint | number
    userAccount?: StringFilter<"user"> | string
    userPassword?: StringFilter<"user"> | string
    unionId?: StringNullableFilter<"user"> | string | null
    mpOpenId?: StringNullableFilter<"user"> | string | null
    userName?: StringNullableFilter<"user"> | string | null
    userAvatar?: StringNullableFilter<"user"> | string | null
    userProfile?: StringNullableFilter<"user"> | string | null
    userRole?: StringFilter<"user"> | string
    createTime?: DateTimeFilter<"user"> | Date | string
    updateTime?: DateTimeFilter<"user"> | Date | string
    isDelete?: IntFilter<"user"> | number
    audio_file?: Audio_fileListRelationFilter
    user_config?: XOR<User_configNullableScalarRelationFilter, user_configWhereInput> | null
  }

  export type userOrderByWithRelationInput = {
    id?: SortOrder
    userAccount?: SortOrder
    userPassword?: SortOrder
    unionId?: SortOrderInput | SortOrder
    mpOpenId?: SortOrderInput | SortOrder
    userName?: SortOrderInput | SortOrder
    userAvatar?: SortOrderInput | SortOrder
    userProfile?: SortOrderInput | SortOrder
    userRole?: SortOrder
    createTime?: SortOrder
    updateTime?: SortOrder
    isDelete?: SortOrder
    audio_file?: audio_fileOrderByRelationAggregateInput
    user_config?: user_configOrderByWithRelationInput
    _relevance?: userOrderByRelevanceInput
  }

  export type userWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: userWhereInput | userWhereInput[]
    OR?: userWhereInput[]
    NOT?: userWhereInput | userWhereInput[]
    userAccount?: StringFilter<"user"> | string
    userPassword?: StringFilter<"user"> | string
    unionId?: StringNullableFilter<"user"> | string | null
    mpOpenId?: StringNullableFilter<"user"> | string | null
    userName?: StringNullableFilter<"user"> | string | null
    userAvatar?: StringNullableFilter<"user"> | string | null
    userProfile?: StringNullableFilter<"user"> | string | null
    userRole?: StringFilter<"user"> | string
    createTime?: DateTimeFilter<"user"> | Date | string
    updateTime?: DateTimeFilter<"user"> | Date | string
    isDelete?: IntFilter<"user"> | number
    audio_file?: Audio_fileListRelationFilter
    user_config?: XOR<User_configNullableScalarRelationFilter, user_configWhereInput> | null
  }, "id">

  export type userOrderByWithAggregationInput = {
    id?: SortOrder
    userAccount?: SortOrder
    userPassword?: SortOrder
    unionId?: SortOrderInput | SortOrder
    mpOpenId?: SortOrderInput | SortOrder
    userName?: SortOrderInput | SortOrder
    userAvatar?: SortOrderInput | SortOrder
    userProfile?: SortOrderInput | SortOrder
    userRole?: SortOrder
    createTime?: SortOrder
    updateTime?: SortOrder
    isDelete?: SortOrder
    _count?: userCountOrderByAggregateInput
    _avg?: userAvgOrderByAggregateInput
    _max?: userMaxOrderByAggregateInput
    _min?: userMinOrderByAggregateInput
    _sum?: userSumOrderByAggregateInput
  }

  export type userScalarWhereWithAggregatesInput = {
    AND?: userScalarWhereWithAggregatesInput | userScalarWhereWithAggregatesInput[]
    OR?: userScalarWhereWithAggregatesInput[]
    NOT?: userScalarWhereWithAggregatesInput | userScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"user"> | bigint | number
    userAccount?: StringWithAggregatesFilter<"user"> | string
    userPassword?: StringWithAggregatesFilter<"user"> | string
    unionId?: StringNullableWithAggregatesFilter<"user"> | string | null
    mpOpenId?: StringNullableWithAggregatesFilter<"user"> | string | null
    userName?: StringNullableWithAggregatesFilter<"user"> | string | null
    userAvatar?: StringNullableWithAggregatesFilter<"user"> | string | null
    userProfile?: StringNullableWithAggregatesFilter<"user"> | string | null
    userRole?: StringWithAggregatesFilter<"user"> | string
    createTime?: DateTimeWithAggregatesFilter<"user"> | Date | string
    updateTime?: DateTimeWithAggregatesFilter<"user"> | Date | string
    isDelete?: IntWithAggregatesFilter<"user"> | number
  }

  export type user_configWhereInput = {
    AND?: user_configWhereInput | user_configWhereInput[]
    OR?: user_configWhereInput[]
    NOT?: user_configWhereInput | user_configWhereInput[]
    user_id?: BigIntFilter<"user_config"> | bigint | number
    config_json?: JsonFilter<"user_config">
    update_time?: DateTimeNullableFilter<"user_config"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, userWhereInput>
  }

  export type user_configOrderByWithRelationInput = {
    user_id?: SortOrder
    config_json?: SortOrder
    update_time?: SortOrderInput | SortOrder
    user?: userOrderByWithRelationInput
  }

  export type user_configWhereUniqueInput = Prisma.AtLeast<{
    user_id?: bigint | number
    AND?: user_configWhereInput | user_configWhereInput[]
    OR?: user_configWhereInput[]
    NOT?: user_configWhereInput | user_configWhereInput[]
    config_json?: JsonFilter<"user_config">
    update_time?: DateTimeNullableFilter<"user_config"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, userWhereInput>
  }, "user_id">

  export type user_configOrderByWithAggregationInput = {
    user_id?: SortOrder
    config_json?: SortOrder
    update_time?: SortOrderInput | SortOrder
    _count?: user_configCountOrderByAggregateInput
    _avg?: user_configAvgOrderByAggregateInput
    _max?: user_configMaxOrderByAggregateInput
    _min?: user_configMinOrderByAggregateInput
    _sum?: user_configSumOrderByAggregateInput
  }

  export type user_configScalarWhereWithAggregatesInput = {
    AND?: user_configScalarWhereWithAggregatesInput | user_configScalarWhereWithAggregatesInput[]
    OR?: user_configScalarWhereWithAggregatesInput[]
    NOT?: user_configScalarWhereWithAggregatesInput | user_configScalarWhereWithAggregatesInput[]
    user_id?: BigIntWithAggregatesFilter<"user_config"> | bigint | number
    config_json?: JsonWithAggregatesFilter<"user_config">
    update_time?: DateTimeNullableWithAggregatesFilter<"user_config"> | Date | string | null
  }

  export type word_status_changeWhereInput = {
    AND?: word_status_changeWhereInput | word_status_changeWhereInput[]
    OR?: word_status_changeWhereInput[]
    NOT?: word_status_changeWhereInput | word_status_changeWhereInput[]
    id?: BigIntFilter<"word_status_change"> | bigint | number
    word_id?: BigIntFilter<"word_status_change"> | bigint | number
    status?: StringFilter<"word_status_change"> | string
    info?: JsonNullableFilter<"word_status_change">
    comment?: StringNullableFilter<"word_status_change"> | string | null
    create_time?: DateTimeNullableFilter<"word_status_change"> | Date | string | null
    update_time?: DateTimeNullableFilter<"word_status_change"> | Date | string | null
    is_delete?: IntNullableFilter<"word_status_change"> | number | null
  }

  export type word_status_changeOrderByWithRelationInput = {
    id?: SortOrder
    word_id?: SortOrder
    status?: SortOrder
    info?: SortOrderInput | SortOrder
    comment?: SortOrderInput | SortOrder
    create_time?: SortOrderInput | SortOrder
    update_time?: SortOrderInput | SortOrder
    is_delete?: SortOrderInput | SortOrder
    _relevance?: word_status_changeOrderByRelevanceInput
  }

  export type word_status_changeWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: word_status_changeWhereInput | word_status_changeWhereInput[]
    OR?: word_status_changeWhereInput[]
    NOT?: word_status_changeWhereInput | word_status_changeWhereInput[]
    word_id?: BigIntFilter<"word_status_change"> | bigint | number
    status?: StringFilter<"word_status_change"> | string
    info?: JsonNullableFilter<"word_status_change">
    comment?: StringNullableFilter<"word_status_change"> | string | null
    create_time?: DateTimeNullableFilter<"word_status_change"> | Date | string | null
    update_time?: DateTimeNullableFilter<"word_status_change"> | Date | string | null
    is_delete?: IntNullableFilter<"word_status_change"> | number | null
  }, "id">

  export type word_status_changeOrderByWithAggregationInput = {
    id?: SortOrder
    word_id?: SortOrder
    status?: SortOrder
    info?: SortOrderInput | SortOrder
    comment?: SortOrderInput | SortOrder
    create_time?: SortOrderInput | SortOrder
    update_time?: SortOrderInput | SortOrder
    is_delete?: SortOrderInput | SortOrder
    _count?: word_status_changeCountOrderByAggregateInput
    _avg?: word_status_changeAvgOrderByAggregateInput
    _max?: word_status_changeMaxOrderByAggregateInput
    _min?: word_status_changeMinOrderByAggregateInput
    _sum?: word_status_changeSumOrderByAggregateInput
  }

  export type word_status_changeScalarWhereWithAggregatesInput = {
    AND?: word_status_changeScalarWhereWithAggregatesInput | word_status_changeScalarWhereWithAggregatesInput[]
    OR?: word_status_changeScalarWhereWithAggregatesInput[]
    NOT?: word_status_changeScalarWhereWithAggregatesInput | word_status_changeScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"word_status_change"> | bigint | number
    word_id?: BigIntWithAggregatesFilter<"word_status_change"> | bigint | number
    status?: StringWithAggregatesFilter<"word_status_change"> | string
    info?: JsonNullableWithAggregatesFilter<"word_status_change">
    comment?: StringNullableWithAggregatesFilter<"word_status_change"> | string | null
    create_time?: DateTimeNullableWithAggregatesFilter<"word_status_change"> | Date | string | null
    update_time?: DateTimeNullableWithAggregatesFilter<"word_status_change"> | Date | string | null
    is_delete?: IntNullableWithAggregatesFilter<"word_status_change"> | number | null
  }

  export type audio_fileCreateInput = {
    id?: bigint | number
    path?: string | null
    content?: string | null
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: number | null
    status?: string
    name?: string
    user?: userCreateNestedOneWithoutAudio_fileInput
  }

  export type audio_fileUncheckedCreateInput = {
    id?: bigint | number
    path?: string | null
    content?: string | null
    creator_id?: bigint | number | null
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: number | null
    status?: string
    name?: string
  }

  export type audio_fileUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    path?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    user?: userUpdateOneWithoutAudio_fileNestedInput
  }

  export type audio_fileUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    path?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    creator_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type audio_fileCreateManyInput = {
    id?: bigint | number
    path?: string | null
    content?: string | null
    creator_id?: bigint | number | null
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: number | null
    status?: string
    name?: string
  }

  export type audio_fileUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    path?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type audio_fileUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    path?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    creator_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type categoryCreateInput = {
    parent_id?: number | null
    name: string
    sort_order?: number | null
    description?: string | null
    is_root?: boolean | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type categoryUncheckedCreateInput = {
    id?: number
    parent_id?: number | null
    name: string
    sort_order?: number | null
    description?: string | null
    is_root?: boolean | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type categoryUpdateInput = {
    parent_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    sort_order?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    is_root?: NullableBoolFieldUpdateOperationsInput | boolean | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type categoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    parent_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    sort_order?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    is_root?: NullableBoolFieldUpdateOperationsInput | boolean | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type categoryCreateManyInput = {
    id?: number
    parent_id?: number | null
    name: string
    sort_order?: number | null
    description?: string | null
    is_root?: boolean | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type categoryUpdateManyMutationInput = {
    parent_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    sort_order?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    is_root?: NullableBoolFieldUpdateOperationsInput | boolean | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type categoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    parent_id?: NullableIntFieldUpdateOperationsInput | number | null
    name?: StringFieldUpdateOperationsInput | string
    sort_order?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    is_root?: NullableBoolFieldUpdateOperationsInput | boolean | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type dictionary_categoryCreateInput = {
    dictionary_id: bigint | number
    category_id: number
    sort_order?: number | null
    created_at?: Date | string | null
  }

  export type dictionary_categoryUncheckedCreateInput = {
    id?: number
    dictionary_id: bigint | number
    category_id: number
    sort_order?: number | null
    created_at?: Date | string | null
  }

  export type dictionary_categoryUpdateInput = {
    dictionary_id?: BigIntFieldUpdateOperationsInput | bigint | number
    category_id?: IntFieldUpdateOperationsInput | number
    sort_order?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type dictionary_categoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    dictionary_id?: BigIntFieldUpdateOperationsInput | bigint | number
    category_id?: IntFieldUpdateOperationsInput | number
    sort_order?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type dictionary_categoryCreateManyInput = {
    id?: number
    dictionary_id: bigint | number
    category_id: number
    sort_order?: number | null
    created_at?: Date | string | null
  }

  export type dictionary_categoryUpdateManyMutationInput = {
    dictionary_id?: BigIntFieldUpdateOperationsInput | bigint | number
    category_id?: IntFieldUpdateOperationsInput | number
    sort_order?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type dictionary_categoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    dictionary_id?: BigIntFieldUpdateOperationsInput | bigint | number
    category_id?: IntFieldUpdateOperationsInput | number
    sort_order?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type dictionary_wordCreateInput = {
    created_at?: Date | string | null
    id?: bigint | number | null
    english_dictionary: english_dictionaryCreateNestedOneWithoutDictionary_wordInput
    english_word: english_wordCreateNestedOneWithoutDictionary_wordInput
  }

  export type dictionary_wordUncheckedCreateInput = {
    dictionary_id: bigint | number
    word_id: bigint | number
    created_at?: Date | string | null
    id?: bigint | number | null
  }

  export type dictionary_wordUpdateInput = {
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    english_dictionary?: english_dictionaryUpdateOneRequiredWithoutDictionary_wordNestedInput
    english_word?: english_wordUpdateOneRequiredWithoutDictionary_wordNestedInput
  }

  export type dictionary_wordUncheckedUpdateInput = {
    dictionary_id?: BigIntFieldUpdateOperationsInput | bigint | number
    word_id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type dictionary_wordCreateManyInput = {
    dictionary_id: bigint | number
    word_id: bigint | number
    created_at?: Date | string | null
    id?: bigint | number | null
  }

  export type dictionary_wordUpdateManyMutationInput = {
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type dictionary_wordUncheckedUpdateManyInput = {
    dictionary_id?: BigIntFieldUpdateOperationsInput | bigint | number
    word_id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type english_dictionaryCreateInput = {
    id: bigint | number
    name?: string | null
    description?: string | null
    image_url?: string | null
    author?: string | null
    isbn?: string | null
    publication_date?: Date | string | null
    publisher?: string | null
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: boolean | null
    total_words?: number | null
    published_words?: number | null
    approved_words?: number | null
    dictionary_word?: dictionary_wordCreateNestedManyWithoutEnglish_dictionaryInput
  }

  export type english_dictionaryUncheckedCreateInput = {
    id: bigint | number
    name?: string | null
    description?: string | null
    image_url?: string | null
    author?: string | null
    isbn?: string | null
    publication_date?: Date | string | null
    publisher?: string | null
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: boolean | null
    total_words?: number | null
    published_words?: number | null
    approved_words?: number | null
    dictionary_word?: dictionary_wordUncheckedCreateNestedManyWithoutEnglish_dictionaryInput
  }

  export type english_dictionaryUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    author?: NullableStringFieldUpdateOperationsInput | string | null
    isbn?: NullableStringFieldUpdateOperationsInput | string | null
    publication_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publisher?: NullableStringFieldUpdateOperationsInput | string | null
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    total_words?: NullableIntFieldUpdateOperationsInput | number | null
    published_words?: NullableIntFieldUpdateOperationsInput | number | null
    approved_words?: NullableIntFieldUpdateOperationsInput | number | null
    dictionary_word?: dictionary_wordUpdateManyWithoutEnglish_dictionaryNestedInput
  }

  export type english_dictionaryUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    author?: NullableStringFieldUpdateOperationsInput | string | null
    isbn?: NullableStringFieldUpdateOperationsInput | string | null
    publication_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publisher?: NullableStringFieldUpdateOperationsInput | string | null
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    total_words?: NullableIntFieldUpdateOperationsInput | number | null
    published_words?: NullableIntFieldUpdateOperationsInput | number | null
    approved_words?: NullableIntFieldUpdateOperationsInput | number | null
    dictionary_word?: dictionary_wordUncheckedUpdateManyWithoutEnglish_dictionaryNestedInput
  }

  export type english_dictionaryCreateManyInput = {
    id: bigint | number
    name?: string | null
    description?: string | null
    image_url?: string | null
    author?: string | null
    isbn?: string | null
    publication_date?: Date | string | null
    publisher?: string | null
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: boolean | null
    total_words?: number | null
    published_words?: number | null
    approved_words?: number | null
  }

  export type english_dictionaryUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    author?: NullableStringFieldUpdateOperationsInput | string | null
    isbn?: NullableStringFieldUpdateOperationsInput | string | null
    publication_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publisher?: NullableStringFieldUpdateOperationsInput | string | null
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    total_words?: NullableIntFieldUpdateOperationsInput | number | null
    published_words?: NullableIntFieldUpdateOperationsInput | number | null
    approved_words?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type english_dictionaryUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    author?: NullableStringFieldUpdateOperationsInput | string | null
    isbn?: NullableStringFieldUpdateOperationsInput | string | null
    publication_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publisher?: NullableStringFieldUpdateOperationsInput | string | null
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    total_words?: NullableIntFieldUpdateOperationsInput | number | null
    published_words?: NullableIntFieldUpdateOperationsInput | number | null
    approved_words?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type english_wordCreateInput = {
    id: bigint | number
    word_head?: string | null
    thumbnail?: string | null
    info?: NullableJsonNullValueInput | InputJsonValue
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: boolean | null
    status?: string | null
    manual_score?: number | null
    ai_score?: number | null
    reviewer?: bigint | number | null
    dictionary_word?: dictionary_wordCreateNestedManyWithoutEnglish_wordInput
    english_word_change_log?: english_word_change_logCreateNestedManyWithoutEnglish_wordInput
    media_creator?: media_creatorCreateNestedManyWithoutEnglish_wordInput
  }

  export type english_wordUncheckedCreateInput = {
    id: bigint | number
    word_head?: string | null
    thumbnail?: string | null
    info?: NullableJsonNullValueInput | InputJsonValue
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: boolean | null
    status?: string | null
    manual_score?: number | null
    ai_score?: number | null
    reviewer?: bigint | number | null
    dictionary_word?: dictionary_wordUncheckedCreateNestedManyWithoutEnglish_wordInput
    english_word_change_log?: english_word_change_logUncheckedCreateNestedManyWithoutEnglish_wordInput
    media_creator?: media_creatorUncheckedCreateNestedManyWithoutEnglish_wordInput
  }

  export type english_wordUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    word_head?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    info?: NullableJsonNullValueInput | InputJsonValue
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    manual_score?: NullableIntFieldUpdateOperationsInput | number | null
    ai_score?: NullableIntFieldUpdateOperationsInput | number | null
    reviewer?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    dictionary_word?: dictionary_wordUpdateManyWithoutEnglish_wordNestedInput
    english_word_change_log?: english_word_change_logUpdateManyWithoutEnglish_wordNestedInput
    media_creator?: media_creatorUpdateManyWithoutEnglish_wordNestedInput
  }

  export type english_wordUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    word_head?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    info?: NullableJsonNullValueInput | InputJsonValue
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    manual_score?: NullableIntFieldUpdateOperationsInput | number | null
    ai_score?: NullableIntFieldUpdateOperationsInput | number | null
    reviewer?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    dictionary_word?: dictionary_wordUncheckedUpdateManyWithoutEnglish_wordNestedInput
    english_word_change_log?: english_word_change_logUncheckedUpdateManyWithoutEnglish_wordNestedInput
    media_creator?: media_creatorUncheckedUpdateManyWithoutEnglish_wordNestedInput
  }

  export type english_wordCreateManyInput = {
    id: bigint | number
    word_head?: string | null
    thumbnail?: string | null
    info?: NullableJsonNullValueInput | InputJsonValue
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: boolean | null
    status?: string | null
    manual_score?: number | null
    ai_score?: number | null
    reviewer?: bigint | number | null
  }

  export type english_wordUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    word_head?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    info?: NullableJsonNullValueInput | InputJsonValue
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    manual_score?: NullableIntFieldUpdateOperationsInput | number | null
    ai_score?: NullableIntFieldUpdateOperationsInput | number | null
    reviewer?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type english_wordUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    word_head?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    info?: NullableJsonNullValueInput | InputJsonValue
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    manual_score?: NullableIntFieldUpdateOperationsInput | number | null
    ai_score?: NullableIntFieldUpdateOperationsInput | number | null
    reviewer?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type english_word_change_logCreateInput = {
    id: bigint | number
    field_name: string
    old_value?: string | null
    new_value?: string | null
    change_time?: Date | string
    changed_by?: bigint | number | null
    english_word: english_wordCreateNestedOneWithoutEnglish_word_change_logInput
  }

  export type english_word_change_logUncheckedCreateInput = {
    id: bigint | number
    english_word_id: bigint | number
    field_name: string
    old_value?: string | null
    new_value?: string | null
    change_time?: Date | string
    changed_by?: bigint | number | null
  }

  export type english_word_change_logUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    field_name?: StringFieldUpdateOperationsInput | string
    old_value?: NullableStringFieldUpdateOperationsInput | string | null
    new_value?: NullableStringFieldUpdateOperationsInput | string | null
    change_time?: DateTimeFieldUpdateOperationsInput | Date | string
    changed_by?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    english_word?: english_wordUpdateOneRequiredWithoutEnglish_word_change_logNestedInput
  }

  export type english_word_change_logUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    english_word_id?: BigIntFieldUpdateOperationsInput | bigint | number
    field_name?: StringFieldUpdateOperationsInput | string
    old_value?: NullableStringFieldUpdateOperationsInput | string | null
    new_value?: NullableStringFieldUpdateOperationsInput | string | null
    change_time?: DateTimeFieldUpdateOperationsInput | Date | string
    changed_by?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type english_word_change_logCreateManyInput = {
    id: bigint | number
    english_word_id: bigint | number
    field_name: string
    old_value?: string | null
    new_value?: string | null
    change_time?: Date | string
    changed_by?: bigint | number | null
  }

  export type english_word_change_logUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    field_name?: StringFieldUpdateOperationsInput | string
    old_value?: NullableStringFieldUpdateOperationsInput | string | null
    new_value?: NullableStringFieldUpdateOperationsInput | string | null
    change_time?: DateTimeFieldUpdateOperationsInput | Date | string
    changed_by?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type english_word_change_logUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    english_word_id?: BigIntFieldUpdateOperationsInput | bigint | number
    field_name?: StringFieldUpdateOperationsInput | string
    old_value?: NullableStringFieldUpdateOperationsInput | string | null
    new_value?: NullableStringFieldUpdateOperationsInput | string | null
    change_time?: DateTimeFieldUpdateOperationsInput | Date | string
    changed_by?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type media_creatorCreateInput = {
    id?: bigint | number
    media_type: string
    media_url?: string | null
    creator_id?: bigint | number | null
    info?: string | null
    created_at?: Date | string | null
    english_word: english_wordCreateNestedOneWithoutMedia_creatorInput
  }

  export type media_creatorUncheckedCreateInput = {
    id?: bigint | number
    word_id: bigint | number
    media_type: string
    media_url?: string | null
    creator_id?: bigint | number | null
    info?: string | null
    created_at?: Date | string | null
  }

  export type media_creatorUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    media_type?: StringFieldUpdateOperationsInput | string
    media_url?: NullableStringFieldUpdateOperationsInput | string | null
    creator_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    info?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    english_word?: english_wordUpdateOneRequiredWithoutMedia_creatorNestedInput
  }

  export type media_creatorUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    word_id?: BigIntFieldUpdateOperationsInput | bigint | number
    media_type?: StringFieldUpdateOperationsInput | string
    media_url?: NullableStringFieldUpdateOperationsInput | string | null
    creator_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    info?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type media_creatorCreateManyInput = {
    id?: bigint | number
    word_id: bigint | number
    media_type: string
    media_url?: string | null
    creator_id?: bigint | number | null
    info?: string | null
    created_at?: Date | string | null
  }

  export type media_creatorUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    media_type?: StringFieldUpdateOperationsInput | string
    media_url?: NullableStringFieldUpdateOperationsInput | string | null
    creator_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    info?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type media_creatorUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    word_id?: BigIntFieldUpdateOperationsInput | bigint | number
    media_type?: StringFieldUpdateOperationsInput | string
    media_url?: NullableStringFieldUpdateOperationsInput | string | null
    creator_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    info?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type postCreateInput = {
    id?: bigint | number
    title?: string | null
    content?: string | null
    tags?: string | null
    thumbNum?: number
    favourNum?: number
    userId: bigint | number
    createTime?: Date | string
    updateTime?: Date | string
    isDelete?: number
  }

  export type postUncheckedCreateInput = {
    id?: bigint | number
    title?: string | null
    content?: string | null
    tags?: string | null
    thumbNum?: number
    favourNum?: number
    userId: bigint | number
    createTime?: Date | string
    updateTime?: Date | string
    isDelete?: number
  }

  export type postUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    thumbNum?: IntFieldUpdateOperationsInput | number
    favourNum?: IntFieldUpdateOperationsInput | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    updateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    isDelete?: IntFieldUpdateOperationsInput | number
  }

  export type postUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    thumbNum?: IntFieldUpdateOperationsInput | number
    favourNum?: IntFieldUpdateOperationsInput | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    updateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    isDelete?: IntFieldUpdateOperationsInput | number
  }

  export type postCreateManyInput = {
    id?: bigint | number
    title?: string | null
    content?: string | null
    tags?: string | null
    thumbNum?: number
    favourNum?: number
    userId: bigint | number
    createTime?: Date | string
    updateTime?: Date | string
    isDelete?: number
  }

  export type postUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    thumbNum?: IntFieldUpdateOperationsInput | number
    favourNum?: IntFieldUpdateOperationsInput | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    updateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    isDelete?: IntFieldUpdateOperationsInput | number
  }

  export type postUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    thumbNum?: IntFieldUpdateOperationsInput | number
    favourNum?: IntFieldUpdateOperationsInput | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    updateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    isDelete?: IntFieldUpdateOperationsInput | number
  }

  export type post_favourCreateInput = {
    id?: bigint | number
    postId: bigint | number
    userId: bigint | number
    createTime?: Date | string
    updateTime?: Date | string
  }

  export type post_favourUncheckedCreateInput = {
    id?: bigint | number
    postId: bigint | number
    userId: bigint | number
    createTime?: Date | string
    updateTime?: Date | string
  }

  export type post_favourUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    postId?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    updateTime?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type post_favourUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    postId?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    updateTime?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type post_favourCreateManyInput = {
    id?: bigint | number
    postId: bigint | number
    userId: bigint | number
    createTime?: Date | string
    updateTime?: Date | string
  }

  export type post_favourUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    postId?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    updateTime?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type post_favourUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    postId?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    updateTime?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type post_thumbCreateInput = {
    id?: bigint | number
    postId: bigint | number
    userId: bigint | number
    createTime?: Date | string
    updateTime?: Date | string
  }

  export type post_thumbUncheckedCreateInput = {
    id?: bigint | number
    postId: bigint | number
    userId: bigint | number
    createTime?: Date | string
    updateTime?: Date | string
  }

  export type post_thumbUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    postId?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    updateTime?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type post_thumbUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    postId?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    updateTime?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type post_thumbCreateManyInput = {
    id?: bigint | number
    postId: bigint | number
    userId: bigint | number
    createTime?: Date | string
    updateTime?: Date | string
  }

  export type post_thumbUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    postId?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    updateTime?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type post_thumbUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    postId?: BigIntFieldUpdateOperationsInput | bigint | number
    userId?: BigIntFieldUpdateOperationsInput | bigint | number
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    updateTime?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type userCreateInput = {
    id?: bigint | number
    userAccount: string
    userPassword: string
    unionId?: string | null
    mpOpenId?: string | null
    userName?: string | null
    userAvatar?: string | null
    userProfile?: string | null
    userRole?: string
    createTime?: Date | string
    updateTime?: Date | string
    isDelete?: number
    audio_file?: audio_fileCreateNestedManyWithoutUserInput
    user_config?: user_configCreateNestedOneWithoutUserInput
  }

  export type userUncheckedCreateInput = {
    id?: bigint | number
    userAccount: string
    userPassword: string
    unionId?: string | null
    mpOpenId?: string | null
    userName?: string | null
    userAvatar?: string | null
    userProfile?: string | null
    userRole?: string
    createTime?: Date | string
    updateTime?: Date | string
    isDelete?: number
    audio_file?: audio_fileUncheckedCreateNestedManyWithoutUserInput
    user_config?: user_configUncheckedCreateNestedOneWithoutUserInput
  }

  export type userUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userAccount?: StringFieldUpdateOperationsInput | string
    userPassword?: StringFieldUpdateOperationsInput | string
    unionId?: NullableStringFieldUpdateOperationsInput | string | null
    mpOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    userName?: NullableStringFieldUpdateOperationsInput | string | null
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    userProfile?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    updateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    isDelete?: IntFieldUpdateOperationsInput | number
    audio_file?: audio_fileUpdateManyWithoutUserNestedInput
    user_config?: user_configUpdateOneWithoutUserNestedInput
  }

  export type userUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userAccount?: StringFieldUpdateOperationsInput | string
    userPassword?: StringFieldUpdateOperationsInput | string
    unionId?: NullableStringFieldUpdateOperationsInput | string | null
    mpOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    userName?: NullableStringFieldUpdateOperationsInput | string | null
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    userProfile?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    updateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    isDelete?: IntFieldUpdateOperationsInput | number
    audio_file?: audio_fileUncheckedUpdateManyWithoutUserNestedInput
    user_config?: user_configUncheckedUpdateOneWithoutUserNestedInput
  }

  export type userCreateManyInput = {
    id?: bigint | number
    userAccount: string
    userPassword: string
    unionId?: string | null
    mpOpenId?: string | null
    userName?: string | null
    userAvatar?: string | null
    userProfile?: string | null
    userRole?: string
    createTime?: Date | string
    updateTime?: Date | string
    isDelete?: number
  }

  export type userUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userAccount?: StringFieldUpdateOperationsInput | string
    userPassword?: StringFieldUpdateOperationsInput | string
    unionId?: NullableStringFieldUpdateOperationsInput | string | null
    mpOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    userName?: NullableStringFieldUpdateOperationsInput | string | null
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    userProfile?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    updateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    isDelete?: IntFieldUpdateOperationsInput | number
  }

  export type userUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userAccount?: StringFieldUpdateOperationsInput | string
    userPassword?: StringFieldUpdateOperationsInput | string
    unionId?: NullableStringFieldUpdateOperationsInput | string | null
    mpOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    userName?: NullableStringFieldUpdateOperationsInput | string | null
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    userProfile?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    updateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    isDelete?: IntFieldUpdateOperationsInput | number
  }

  export type user_configCreateInput = {
    config_json: JsonNullValueInput | InputJsonValue
    update_time?: Date | string | null
    user: userCreateNestedOneWithoutUser_configInput
  }

  export type user_configUncheckedCreateInput = {
    user_id: bigint | number
    config_json: JsonNullValueInput | InputJsonValue
    update_time?: Date | string | null
  }

  export type user_configUpdateInput = {
    config_json?: JsonNullValueInput | InputJsonValue
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: userUpdateOneRequiredWithoutUser_configNestedInput
  }

  export type user_configUncheckedUpdateInput = {
    user_id?: BigIntFieldUpdateOperationsInput | bigint | number
    config_json?: JsonNullValueInput | InputJsonValue
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type user_configCreateManyInput = {
    user_id: bigint | number
    config_json: JsonNullValueInput | InputJsonValue
    update_time?: Date | string | null
  }

  export type user_configUpdateManyMutationInput = {
    config_json?: JsonNullValueInput | InputJsonValue
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type user_configUncheckedUpdateManyInput = {
    user_id?: BigIntFieldUpdateOperationsInput | bigint | number
    config_json?: JsonNullValueInput | InputJsonValue
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type word_status_changeCreateInput = {
    id?: bigint | number
    word_id: bigint | number
    status: string
    info?: NullableJsonNullValueInput | InputJsonValue
    comment?: string | null
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: number | null
  }

  export type word_status_changeUncheckedCreateInput = {
    id?: bigint | number
    word_id: bigint | number
    status: string
    info?: NullableJsonNullValueInput | InputJsonValue
    comment?: string | null
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: number | null
  }

  export type word_status_changeUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    word_id?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: StringFieldUpdateOperationsInput | string
    info?: NullableJsonNullValueInput | InputJsonValue
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type word_status_changeUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    word_id?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: StringFieldUpdateOperationsInput | string
    info?: NullableJsonNullValueInput | InputJsonValue
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type word_status_changeCreateManyInput = {
    id?: bigint | number
    word_id: bigint | number
    status: string
    info?: NullableJsonNullValueInput | InputJsonValue
    comment?: string | null
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: number | null
  }

  export type word_status_changeUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    word_id?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: StringFieldUpdateOperationsInput | string
    info?: NullableJsonNullValueInput | InputJsonValue
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type word_status_changeUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    word_id?: BigIntFieldUpdateOperationsInput | bigint | number
    status?: StringFieldUpdateOperationsInput | string
    info?: NullableJsonNullValueInput | InputJsonValue
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type UserNullableScalarRelationFilter = {
    is?: userWhereInput | null
    isNot?: userWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type audio_fileOrderByRelevanceInput = {
    fields: audio_fileOrderByRelevanceFieldEnum | audio_fileOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type audio_fileCountOrderByAggregateInput = {
    id?: SortOrder
    path?: SortOrder
    content?: SortOrder
    creator_id?: SortOrder
    create_time?: SortOrder
    update_time?: SortOrder
    is_delete?: SortOrder
    status?: SortOrder
    name?: SortOrder
  }

  export type audio_fileAvgOrderByAggregateInput = {
    id?: SortOrder
    creator_id?: SortOrder
    is_delete?: SortOrder
  }

  export type audio_fileMaxOrderByAggregateInput = {
    id?: SortOrder
    path?: SortOrder
    content?: SortOrder
    creator_id?: SortOrder
    create_time?: SortOrder
    update_time?: SortOrder
    is_delete?: SortOrder
    status?: SortOrder
    name?: SortOrder
  }

  export type audio_fileMinOrderByAggregateInput = {
    id?: SortOrder
    path?: SortOrder
    content?: SortOrder
    creator_id?: SortOrder
    create_time?: SortOrder
    update_time?: SortOrder
    is_delete?: SortOrder
    status?: SortOrder
    name?: SortOrder
  }

  export type audio_fileSumOrderByAggregateInput = {
    id?: SortOrder
    creator_id?: SortOrder
    is_delete?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type categoryOrderByRelevanceInput = {
    fields: categoryOrderByRelevanceFieldEnum | categoryOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type categoryCountOrderByAggregateInput = {
    id?: SortOrder
    parent_id?: SortOrder
    name?: SortOrder
    sort_order?: SortOrder
    description?: SortOrder
    is_root?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type categoryAvgOrderByAggregateInput = {
    id?: SortOrder
    parent_id?: SortOrder
    sort_order?: SortOrder
  }

  export type categoryMaxOrderByAggregateInput = {
    id?: SortOrder
    parent_id?: SortOrder
    name?: SortOrder
    sort_order?: SortOrder
    description?: SortOrder
    is_root?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type categoryMinOrderByAggregateInput = {
    id?: SortOrder
    parent_id?: SortOrder
    name?: SortOrder
    sort_order?: SortOrder
    description?: SortOrder
    is_root?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type categorySumOrderByAggregateInput = {
    id?: SortOrder
    parent_id?: SortOrder
    sort_order?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type dictionary_categoryCountOrderByAggregateInput = {
    id?: SortOrder
    dictionary_id?: SortOrder
    category_id?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
  }

  export type dictionary_categoryAvgOrderByAggregateInput = {
    id?: SortOrder
    dictionary_id?: SortOrder
    category_id?: SortOrder
    sort_order?: SortOrder
  }

  export type dictionary_categoryMaxOrderByAggregateInput = {
    id?: SortOrder
    dictionary_id?: SortOrder
    category_id?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
  }

  export type dictionary_categoryMinOrderByAggregateInput = {
    id?: SortOrder
    dictionary_id?: SortOrder
    category_id?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
  }

  export type dictionary_categorySumOrderByAggregateInput = {
    id?: SortOrder
    dictionary_id?: SortOrder
    category_id?: SortOrder
    sort_order?: SortOrder
  }

  export type English_dictionaryScalarRelationFilter = {
    is?: english_dictionaryWhereInput
    isNot?: english_dictionaryWhereInput
  }

  export type English_wordScalarRelationFilter = {
    is?: english_wordWhereInput
    isNot?: english_wordWhereInput
  }

  export type dictionary_wordDictionary_idWord_idCompoundUniqueInput = {
    dictionary_id: bigint | number
    word_id: bigint | number
  }

  export type dictionary_wordCountOrderByAggregateInput = {
    dictionary_id?: SortOrder
    word_id?: SortOrder
    created_at?: SortOrder
    id?: SortOrder
  }

  export type dictionary_wordAvgOrderByAggregateInput = {
    dictionary_id?: SortOrder
    word_id?: SortOrder
    id?: SortOrder
  }

  export type dictionary_wordMaxOrderByAggregateInput = {
    dictionary_id?: SortOrder
    word_id?: SortOrder
    created_at?: SortOrder
    id?: SortOrder
  }

  export type dictionary_wordMinOrderByAggregateInput = {
    dictionary_id?: SortOrder
    word_id?: SortOrder
    created_at?: SortOrder
    id?: SortOrder
  }

  export type dictionary_wordSumOrderByAggregateInput = {
    dictionary_id?: SortOrder
    word_id?: SortOrder
    id?: SortOrder
  }

  export type Dictionary_wordListRelationFilter = {
    every?: dictionary_wordWhereInput
    some?: dictionary_wordWhereInput
    none?: dictionary_wordWhereInput
  }

  export type dictionary_wordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type english_dictionaryOrderByRelevanceInput = {
    fields: english_dictionaryOrderByRelevanceFieldEnum | english_dictionaryOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type english_dictionaryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    image_url?: SortOrder
    author?: SortOrder
    isbn?: SortOrder
    publication_date?: SortOrder
    publisher?: SortOrder
    create_time?: SortOrder
    update_time?: SortOrder
    is_delete?: SortOrder
    total_words?: SortOrder
    published_words?: SortOrder
    approved_words?: SortOrder
  }

  export type english_dictionaryAvgOrderByAggregateInput = {
    id?: SortOrder
    total_words?: SortOrder
    published_words?: SortOrder
    approved_words?: SortOrder
  }

  export type english_dictionaryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    image_url?: SortOrder
    author?: SortOrder
    isbn?: SortOrder
    publication_date?: SortOrder
    publisher?: SortOrder
    create_time?: SortOrder
    update_time?: SortOrder
    is_delete?: SortOrder
    total_words?: SortOrder
    published_words?: SortOrder
    approved_words?: SortOrder
  }

  export type english_dictionaryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    image_url?: SortOrder
    author?: SortOrder
    isbn?: SortOrder
    publication_date?: SortOrder
    publisher?: SortOrder
    create_time?: SortOrder
    update_time?: SortOrder
    is_delete?: SortOrder
    total_words?: SortOrder
    published_words?: SortOrder
    approved_words?: SortOrder
  }

  export type english_dictionarySumOrderByAggregateInput = {
    id?: SortOrder
    total_words?: SortOrder
    published_words?: SortOrder
    approved_words?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type English_word_change_logListRelationFilter = {
    every?: english_word_change_logWhereInput
    some?: english_word_change_logWhereInput
    none?: english_word_change_logWhereInput
  }

  export type Media_creatorListRelationFilter = {
    every?: media_creatorWhereInput
    some?: media_creatorWhereInput
    none?: media_creatorWhereInput
  }

  export type english_word_change_logOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type media_creatorOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type english_wordOrderByRelevanceInput = {
    fields: english_wordOrderByRelevanceFieldEnum | english_wordOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type english_wordCountOrderByAggregateInput = {
    id?: SortOrder
    word_head?: SortOrder
    thumbnail?: SortOrder
    info?: SortOrder
    create_time?: SortOrder
    update_time?: SortOrder
    is_delete?: SortOrder
    status?: SortOrder
    manual_score?: SortOrder
    ai_score?: SortOrder
    reviewer?: SortOrder
  }

  export type english_wordAvgOrderByAggregateInput = {
    id?: SortOrder
    manual_score?: SortOrder
    ai_score?: SortOrder
    reviewer?: SortOrder
  }

  export type english_wordMaxOrderByAggregateInput = {
    id?: SortOrder
    word_head?: SortOrder
    thumbnail?: SortOrder
    create_time?: SortOrder
    update_time?: SortOrder
    is_delete?: SortOrder
    status?: SortOrder
    manual_score?: SortOrder
    ai_score?: SortOrder
    reviewer?: SortOrder
  }

  export type english_wordMinOrderByAggregateInput = {
    id?: SortOrder
    word_head?: SortOrder
    thumbnail?: SortOrder
    create_time?: SortOrder
    update_time?: SortOrder
    is_delete?: SortOrder
    status?: SortOrder
    manual_score?: SortOrder
    ai_score?: SortOrder
    reviewer?: SortOrder
  }

  export type english_wordSumOrderByAggregateInput = {
    id?: SortOrder
    manual_score?: SortOrder
    ai_score?: SortOrder
    reviewer?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type english_word_change_logOrderByRelevanceInput = {
    fields: english_word_change_logOrderByRelevanceFieldEnum | english_word_change_logOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type english_word_change_logCountOrderByAggregateInput = {
    id?: SortOrder
    english_word_id?: SortOrder
    field_name?: SortOrder
    old_value?: SortOrder
    new_value?: SortOrder
    change_time?: SortOrder
    changed_by?: SortOrder
  }

  export type english_word_change_logAvgOrderByAggregateInput = {
    id?: SortOrder
    english_word_id?: SortOrder
    changed_by?: SortOrder
  }

  export type english_word_change_logMaxOrderByAggregateInput = {
    id?: SortOrder
    english_word_id?: SortOrder
    field_name?: SortOrder
    old_value?: SortOrder
    new_value?: SortOrder
    change_time?: SortOrder
    changed_by?: SortOrder
  }

  export type english_word_change_logMinOrderByAggregateInput = {
    id?: SortOrder
    english_word_id?: SortOrder
    field_name?: SortOrder
    old_value?: SortOrder
    new_value?: SortOrder
    change_time?: SortOrder
    changed_by?: SortOrder
  }

  export type english_word_change_logSumOrderByAggregateInput = {
    id?: SortOrder
    english_word_id?: SortOrder
    changed_by?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type media_creatorOrderByRelevanceInput = {
    fields: media_creatorOrderByRelevanceFieldEnum | media_creatorOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type media_creatorCountOrderByAggregateInput = {
    id?: SortOrder
    word_id?: SortOrder
    media_type?: SortOrder
    media_url?: SortOrder
    creator_id?: SortOrder
    info?: SortOrder
    created_at?: SortOrder
  }

  export type media_creatorAvgOrderByAggregateInput = {
    id?: SortOrder
    word_id?: SortOrder
    creator_id?: SortOrder
  }

  export type media_creatorMaxOrderByAggregateInput = {
    id?: SortOrder
    word_id?: SortOrder
    media_type?: SortOrder
    media_url?: SortOrder
    creator_id?: SortOrder
    info?: SortOrder
    created_at?: SortOrder
  }

  export type media_creatorMinOrderByAggregateInput = {
    id?: SortOrder
    word_id?: SortOrder
    media_type?: SortOrder
    media_url?: SortOrder
    creator_id?: SortOrder
    info?: SortOrder
    created_at?: SortOrder
  }

  export type media_creatorSumOrderByAggregateInput = {
    id?: SortOrder
    word_id?: SortOrder
    creator_id?: SortOrder
  }

  export type postOrderByRelevanceInput = {
    fields: postOrderByRelevanceFieldEnum | postOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type postCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    tags?: SortOrder
    thumbNum?: SortOrder
    favourNum?: SortOrder
    userId?: SortOrder
    createTime?: SortOrder
    updateTime?: SortOrder
    isDelete?: SortOrder
  }

  export type postAvgOrderByAggregateInput = {
    id?: SortOrder
    thumbNum?: SortOrder
    favourNum?: SortOrder
    userId?: SortOrder
    isDelete?: SortOrder
  }

  export type postMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    tags?: SortOrder
    thumbNum?: SortOrder
    favourNum?: SortOrder
    userId?: SortOrder
    createTime?: SortOrder
    updateTime?: SortOrder
    isDelete?: SortOrder
  }

  export type postMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    tags?: SortOrder
    thumbNum?: SortOrder
    favourNum?: SortOrder
    userId?: SortOrder
    createTime?: SortOrder
    updateTime?: SortOrder
    isDelete?: SortOrder
  }

  export type postSumOrderByAggregateInput = {
    id?: SortOrder
    thumbNum?: SortOrder
    favourNum?: SortOrder
    userId?: SortOrder
    isDelete?: SortOrder
  }

  export type post_favourCountOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createTime?: SortOrder
    updateTime?: SortOrder
  }

  export type post_favourAvgOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
  }

  export type post_favourMaxOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createTime?: SortOrder
    updateTime?: SortOrder
  }

  export type post_favourMinOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createTime?: SortOrder
    updateTime?: SortOrder
  }

  export type post_favourSumOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
  }

  export type post_thumbCountOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createTime?: SortOrder
    updateTime?: SortOrder
  }

  export type post_thumbAvgOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
  }

  export type post_thumbMaxOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createTime?: SortOrder
    updateTime?: SortOrder
  }

  export type post_thumbMinOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
    createTime?: SortOrder
    updateTime?: SortOrder
  }

  export type post_thumbSumOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
    userId?: SortOrder
  }

  export type Audio_fileListRelationFilter = {
    every?: audio_fileWhereInput
    some?: audio_fileWhereInput
    none?: audio_fileWhereInput
  }

  export type User_configNullableScalarRelationFilter = {
    is?: user_configWhereInput | null
    isNot?: user_configWhereInput | null
  }

  export type audio_fileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type userOrderByRelevanceInput = {
    fields: userOrderByRelevanceFieldEnum | userOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type userCountOrderByAggregateInput = {
    id?: SortOrder
    userAccount?: SortOrder
    userPassword?: SortOrder
    unionId?: SortOrder
    mpOpenId?: SortOrder
    userName?: SortOrder
    userAvatar?: SortOrder
    userProfile?: SortOrder
    userRole?: SortOrder
    createTime?: SortOrder
    updateTime?: SortOrder
    isDelete?: SortOrder
  }

  export type userAvgOrderByAggregateInput = {
    id?: SortOrder
    isDelete?: SortOrder
  }

  export type userMaxOrderByAggregateInput = {
    id?: SortOrder
    userAccount?: SortOrder
    userPassword?: SortOrder
    unionId?: SortOrder
    mpOpenId?: SortOrder
    userName?: SortOrder
    userAvatar?: SortOrder
    userProfile?: SortOrder
    userRole?: SortOrder
    createTime?: SortOrder
    updateTime?: SortOrder
    isDelete?: SortOrder
  }

  export type userMinOrderByAggregateInput = {
    id?: SortOrder
    userAccount?: SortOrder
    userPassword?: SortOrder
    unionId?: SortOrder
    mpOpenId?: SortOrder
    userName?: SortOrder
    userAvatar?: SortOrder
    userProfile?: SortOrder
    userRole?: SortOrder
    createTime?: SortOrder
    updateTime?: SortOrder
    isDelete?: SortOrder
  }

  export type userSumOrderByAggregateInput = {
    id?: SortOrder
    isDelete?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserScalarRelationFilter = {
    is?: userWhereInput
    isNot?: userWhereInput
  }

  export type user_configCountOrderByAggregateInput = {
    user_id?: SortOrder
    config_json?: SortOrder
    update_time?: SortOrder
  }

  export type user_configAvgOrderByAggregateInput = {
    user_id?: SortOrder
  }

  export type user_configMaxOrderByAggregateInput = {
    user_id?: SortOrder
    update_time?: SortOrder
  }

  export type user_configMinOrderByAggregateInput = {
    user_id?: SortOrder
    update_time?: SortOrder
  }

  export type user_configSumOrderByAggregateInput = {
    user_id?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type word_status_changeOrderByRelevanceInput = {
    fields: word_status_changeOrderByRelevanceFieldEnum | word_status_changeOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type word_status_changeCountOrderByAggregateInput = {
    id?: SortOrder
    word_id?: SortOrder
    status?: SortOrder
    info?: SortOrder
    comment?: SortOrder
    create_time?: SortOrder
    update_time?: SortOrder
    is_delete?: SortOrder
  }

  export type word_status_changeAvgOrderByAggregateInput = {
    id?: SortOrder
    word_id?: SortOrder
    is_delete?: SortOrder
  }

  export type word_status_changeMaxOrderByAggregateInput = {
    id?: SortOrder
    word_id?: SortOrder
    status?: SortOrder
    comment?: SortOrder
    create_time?: SortOrder
    update_time?: SortOrder
    is_delete?: SortOrder
  }

  export type word_status_changeMinOrderByAggregateInput = {
    id?: SortOrder
    word_id?: SortOrder
    status?: SortOrder
    comment?: SortOrder
    create_time?: SortOrder
    update_time?: SortOrder
    is_delete?: SortOrder
  }

  export type word_status_changeSumOrderByAggregateInput = {
    id?: SortOrder
    word_id?: SortOrder
    is_delete?: SortOrder
  }

  export type userCreateNestedOneWithoutAudio_fileInput = {
    create?: XOR<userCreateWithoutAudio_fileInput, userUncheckedCreateWithoutAudio_fileInput>
    connectOrCreate?: userCreateOrConnectWithoutAudio_fileInput
    connect?: userWhereUniqueInput
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type userUpdateOneWithoutAudio_fileNestedInput = {
    create?: XOR<userCreateWithoutAudio_fileInput, userUncheckedCreateWithoutAudio_fileInput>
    connectOrCreate?: userCreateOrConnectWithoutAudio_fileInput
    upsert?: userUpsertWithoutAudio_fileInput
    disconnect?: userWhereInput | boolean
    delete?: userWhereInput | boolean
    connect?: userWhereUniqueInput
    update?: XOR<XOR<userUpdateToOneWithWhereWithoutAudio_fileInput, userUpdateWithoutAudio_fileInput>, userUncheckedUpdateWithoutAudio_fileInput>
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type english_dictionaryCreateNestedOneWithoutDictionary_wordInput = {
    create?: XOR<english_dictionaryCreateWithoutDictionary_wordInput, english_dictionaryUncheckedCreateWithoutDictionary_wordInput>
    connectOrCreate?: english_dictionaryCreateOrConnectWithoutDictionary_wordInput
    connect?: english_dictionaryWhereUniqueInput
  }

  export type english_wordCreateNestedOneWithoutDictionary_wordInput = {
    create?: XOR<english_wordCreateWithoutDictionary_wordInput, english_wordUncheckedCreateWithoutDictionary_wordInput>
    connectOrCreate?: english_wordCreateOrConnectWithoutDictionary_wordInput
    connect?: english_wordWhereUniqueInput
  }

  export type english_dictionaryUpdateOneRequiredWithoutDictionary_wordNestedInput = {
    create?: XOR<english_dictionaryCreateWithoutDictionary_wordInput, english_dictionaryUncheckedCreateWithoutDictionary_wordInput>
    connectOrCreate?: english_dictionaryCreateOrConnectWithoutDictionary_wordInput
    upsert?: english_dictionaryUpsertWithoutDictionary_wordInput
    connect?: english_dictionaryWhereUniqueInput
    update?: XOR<XOR<english_dictionaryUpdateToOneWithWhereWithoutDictionary_wordInput, english_dictionaryUpdateWithoutDictionary_wordInput>, english_dictionaryUncheckedUpdateWithoutDictionary_wordInput>
  }

  export type english_wordUpdateOneRequiredWithoutDictionary_wordNestedInput = {
    create?: XOR<english_wordCreateWithoutDictionary_wordInput, english_wordUncheckedCreateWithoutDictionary_wordInput>
    connectOrCreate?: english_wordCreateOrConnectWithoutDictionary_wordInput
    upsert?: english_wordUpsertWithoutDictionary_wordInput
    connect?: english_wordWhereUniqueInput
    update?: XOR<XOR<english_wordUpdateToOneWithWhereWithoutDictionary_wordInput, english_wordUpdateWithoutDictionary_wordInput>, english_wordUncheckedUpdateWithoutDictionary_wordInput>
  }

  export type dictionary_wordCreateNestedManyWithoutEnglish_dictionaryInput = {
    create?: XOR<dictionary_wordCreateWithoutEnglish_dictionaryInput, dictionary_wordUncheckedCreateWithoutEnglish_dictionaryInput> | dictionary_wordCreateWithoutEnglish_dictionaryInput[] | dictionary_wordUncheckedCreateWithoutEnglish_dictionaryInput[]
    connectOrCreate?: dictionary_wordCreateOrConnectWithoutEnglish_dictionaryInput | dictionary_wordCreateOrConnectWithoutEnglish_dictionaryInput[]
    createMany?: dictionary_wordCreateManyEnglish_dictionaryInputEnvelope
    connect?: dictionary_wordWhereUniqueInput | dictionary_wordWhereUniqueInput[]
  }

  export type dictionary_wordUncheckedCreateNestedManyWithoutEnglish_dictionaryInput = {
    create?: XOR<dictionary_wordCreateWithoutEnglish_dictionaryInput, dictionary_wordUncheckedCreateWithoutEnglish_dictionaryInput> | dictionary_wordCreateWithoutEnglish_dictionaryInput[] | dictionary_wordUncheckedCreateWithoutEnglish_dictionaryInput[]
    connectOrCreate?: dictionary_wordCreateOrConnectWithoutEnglish_dictionaryInput | dictionary_wordCreateOrConnectWithoutEnglish_dictionaryInput[]
    createMany?: dictionary_wordCreateManyEnglish_dictionaryInputEnvelope
    connect?: dictionary_wordWhereUniqueInput | dictionary_wordWhereUniqueInput[]
  }

  export type dictionary_wordUpdateManyWithoutEnglish_dictionaryNestedInput = {
    create?: XOR<dictionary_wordCreateWithoutEnglish_dictionaryInput, dictionary_wordUncheckedCreateWithoutEnglish_dictionaryInput> | dictionary_wordCreateWithoutEnglish_dictionaryInput[] | dictionary_wordUncheckedCreateWithoutEnglish_dictionaryInput[]
    connectOrCreate?: dictionary_wordCreateOrConnectWithoutEnglish_dictionaryInput | dictionary_wordCreateOrConnectWithoutEnglish_dictionaryInput[]
    upsert?: dictionary_wordUpsertWithWhereUniqueWithoutEnglish_dictionaryInput | dictionary_wordUpsertWithWhereUniqueWithoutEnglish_dictionaryInput[]
    createMany?: dictionary_wordCreateManyEnglish_dictionaryInputEnvelope
    set?: dictionary_wordWhereUniqueInput | dictionary_wordWhereUniqueInput[]
    disconnect?: dictionary_wordWhereUniqueInput | dictionary_wordWhereUniqueInput[]
    delete?: dictionary_wordWhereUniqueInput | dictionary_wordWhereUniqueInput[]
    connect?: dictionary_wordWhereUniqueInput | dictionary_wordWhereUniqueInput[]
    update?: dictionary_wordUpdateWithWhereUniqueWithoutEnglish_dictionaryInput | dictionary_wordUpdateWithWhereUniqueWithoutEnglish_dictionaryInput[]
    updateMany?: dictionary_wordUpdateManyWithWhereWithoutEnglish_dictionaryInput | dictionary_wordUpdateManyWithWhereWithoutEnglish_dictionaryInput[]
    deleteMany?: dictionary_wordScalarWhereInput | dictionary_wordScalarWhereInput[]
  }

  export type dictionary_wordUncheckedUpdateManyWithoutEnglish_dictionaryNestedInput = {
    create?: XOR<dictionary_wordCreateWithoutEnglish_dictionaryInput, dictionary_wordUncheckedCreateWithoutEnglish_dictionaryInput> | dictionary_wordCreateWithoutEnglish_dictionaryInput[] | dictionary_wordUncheckedCreateWithoutEnglish_dictionaryInput[]
    connectOrCreate?: dictionary_wordCreateOrConnectWithoutEnglish_dictionaryInput | dictionary_wordCreateOrConnectWithoutEnglish_dictionaryInput[]
    upsert?: dictionary_wordUpsertWithWhereUniqueWithoutEnglish_dictionaryInput | dictionary_wordUpsertWithWhereUniqueWithoutEnglish_dictionaryInput[]
    createMany?: dictionary_wordCreateManyEnglish_dictionaryInputEnvelope
    set?: dictionary_wordWhereUniqueInput | dictionary_wordWhereUniqueInput[]
    disconnect?: dictionary_wordWhereUniqueInput | dictionary_wordWhereUniqueInput[]
    delete?: dictionary_wordWhereUniqueInput | dictionary_wordWhereUniqueInput[]
    connect?: dictionary_wordWhereUniqueInput | dictionary_wordWhereUniqueInput[]
    update?: dictionary_wordUpdateWithWhereUniqueWithoutEnglish_dictionaryInput | dictionary_wordUpdateWithWhereUniqueWithoutEnglish_dictionaryInput[]
    updateMany?: dictionary_wordUpdateManyWithWhereWithoutEnglish_dictionaryInput | dictionary_wordUpdateManyWithWhereWithoutEnglish_dictionaryInput[]
    deleteMany?: dictionary_wordScalarWhereInput | dictionary_wordScalarWhereInput[]
  }

  export type dictionary_wordCreateNestedManyWithoutEnglish_wordInput = {
    create?: XOR<dictionary_wordCreateWithoutEnglish_wordInput, dictionary_wordUncheckedCreateWithoutEnglish_wordInput> | dictionary_wordCreateWithoutEnglish_wordInput[] | dictionary_wordUncheckedCreateWithoutEnglish_wordInput[]
    connectOrCreate?: dictionary_wordCreateOrConnectWithoutEnglish_wordInput | dictionary_wordCreateOrConnectWithoutEnglish_wordInput[]
    createMany?: dictionary_wordCreateManyEnglish_wordInputEnvelope
    connect?: dictionary_wordWhereUniqueInput | dictionary_wordWhereUniqueInput[]
  }

  export type english_word_change_logCreateNestedManyWithoutEnglish_wordInput = {
    create?: XOR<english_word_change_logCreateWithoutEnglish_wordInput, english_word_change_logUncheckedCreateWithoutEnglish_wordInput> | english_word_change_logCreateWithoutEnglish_wordInput[] | english_word_change_logUncheckedCreateWithoutEnglish_wordInput[]
    connectOrCreate?: english_word_change_logCreateOrConnectWithoutEnglish_wordInput | english_word_change_logCreateOrConnectWithoutEnglish_wordInput[]
    createMany?: english_word_change_logCreateManyEnglish_wordInputEnvelope
    connect?: english_word_change_logWhereUniqueInput | english_word_change_logWhereUniqueInput[]
  }

  export type media_creatorCreateNestedManyWithoutEnglish_wordInput = {
    create?: XOR<media_creatorCreateWithoutEnglish_wordInput, media_creatorUncheckedCreateWithoutEnglish_wordInput> | media_creatorCreateWithoutEnglish_wordInput[] | media_creatorUncheckedCreateWithoutEnglish_wordInput[]
    connectOrCreate?: media_creatorCreateOrConnectWithoutEnglish_wordInput | media_creatorCreateOrConnectWithoutEnglish_wordInput[]
    createMany?: media_creatorCreateManyEnglish_wordInputEnvelope
    connect?: media_creatorWhereUniqueInput | media_creatorWhereUniqueInput[]
  }

  export type dictionary_wordUncheckedCreateNestedManyWithoutEnglish_wordInput = {
    create?: XOR<dictionary_wordCreateWithoutEnglish_wordInput, dictionary_wordUncheckedCreateWithoutEnglish_wordInput> | dictionary_wordCreateWithoutEnglish_wordInput[] | dictionary_wordUncheckedCreateWithoutEnglish_wordInput[]
    connectOrCreate?: dictionary_wordCreateOrConnectWithoutEnglish_wordInput | dictionary_wordCreateOrConnectWithoutEnglish_wordInput[]
    createMany?: dictionary_wordCreateManyEnglish_wordInputEnvelope
    connect?: dictionary_wordWhereUniqueInput | dictionary_wordWhereUniqueInput[]
  }

  export type english_word_change_logUncheckedCreateNestedManyWithoutEnglish_wordInput = {
    create?: XOR<english_word_change_logCreateWithoutEnglish_wordInput, english_word_change_logUncheckedCreateWithoutEnglish_wordInput> | english_word_change_logCreateWithoutEnglish_wordInput[] | english_word_change_logUncheckedCreateWithoutEnglish_wordInput[]
    connectOrCreate?: english_word_change_logCreateOrConnectWithoutEnglish_wordInput | english_word_change_logCreateOrConnectWithoutEnglish_wordInput[]
    createMany?: english_word_change_logCreateManyEnglish_wordInputEnvelope
    connect?: english_word_change_logWhereUniqueInput | english_word_change_logWhereUniqueInput[]
  }

  export type media_creatorUncheckedCreateNestedManyWithoutEnglish_wordInput = {
    create?: XOR<media_creatorCreateWithoutEnglish_wordInput, media_creatorUncheckedCreateWithoutEnglish_wordInput> | media_creatorCreateWithoutEnglish_wordInput[] | media_creatorUncheckedCreateWithoutEnglish_wordInput[]
    connectOrCreate?: media_creatorCreateOrConnectWithoutEnglish_wordInput | media_creatorCreateOrConnectWithoutEnglish_wordInput[]
    createMany?: media_creatorCreateManyEnglish_wordInputEnvelope
    connect?: media_creatorWhereUniqueInput | media_creatorWhereUniqueInput[]
  }

  export type dictionary_wordUpdateManyWithoutEnglish_wordNestedInput = {
    create?: XOR<dictionary_wordCreateWithoutEnglish_wordInput, dictionary_wordUncheckedCreateWithoutEnglish_wordInput> | dictionary_wordCreateWithoutEnglish_wordInput[] | dictionary_wordUncheckedCreateWithoutEnglish_wordInput[]
    connectOrCreate?: dictionary_wordCreateOrConnectWithoutEnglish_wordInput | dictionary_wordCreateOrConnectWithoutEnglish_wordInput[]
    upsert?: dictionary_wordUpsertWithWhereUniqueWithoutEnglish_wordInput | dictionary_wordUpsertWithWhereUniqueWithoutEnglish_wordInput[]
    createMany?: dictionary_wordCreateManyEnglish_wordInputEnvelope
    set?: dictionary_wordWhereUniqueInput | dictionary_wordWhereUniqueInput[]
    disconnect?: dictionary_wordWhereUniqueInput | dictionary_wordWhereUniqueInput[]
    delete?: dictionary_wordWhereUniqueInput | dictionary_wordWhereUniqueInput[]
    connect?: dictionary_wordWhereUniqueInput | dictionary_wordWhereUniqueInput[]
    update?: dictionary_wordUpdateWithWhereUniqueWithoutEnglish_wordInput | dictionary_wordUpdateWithWhereUniqueWithoutEnglish_wordInput[]
    updateMany?: dictionary_wordUpdateManyWithWhereWithoutEnglish_wordInput | dictionary_wordUpdateManyWithWhereWithoutEnglish_wordInput[]
    deleteMany?: dictionary_wordScalarWhereInput | dictionary_wordScalarWhereInput[]
  }

  export type english_word_change_logUpdateManyWithoutEnglish_wordNestedInput = {
    create?: XOR<english_word_change_logCreateWithoutEnglish_wordInput, english_word_change_logUncheckedCreateWithoutEnglish_wordInput> | english_word_change_logCreateWithoutEnglish_wordInput[] | english_word_change_logUncheckedCreateWithoutEnglish_wordInput[]
    connectOrCreate?: english_word_change_logCreateOrConnectWithoutEnglish_wordInput | english_word_change_logCreateOrConnectWithoutEnglish_wordInput[]
    upsert?: english_word_change_logUpsertWithWhereUniqueWithoutEnglish_wordInput | english_word_change_logUpsertWithWhereUniqueWithoutEnglish_wordInput[]
    createMany?: english_word_change_logCreateManyEnglish_wordInputEnvelope
    set?: english_word_change_logWhereUniqueInput | english_word_change_logWhereUniqueInput[]
    disconnect?: english_word_change_logWhereUniqueInput | english_word_change_logWhereUniqueInput[]
    delete?: english_word_change_logWhereUniqueInput | english_word_change_logWhereUniqueInput[]
    connect?: english_word_change_logWhereUniqueInput | english_word_change_logWhereUniqueInput[]
    update?: english_word_change_logUpdateWithWhereUniqueWithoutEnglish_wordInput | english_word_change_logUpdateWithWhereUniqueWithoutEnglish_wordInput[]
    updateMany?: english_word_change_logUpdateManyWithWhereWithoutEnglish_wordInput | english_word_change_logUpdateManyWithWhereWithoutEnglish_wordInput[]
    deleteMany?: english_word_change_logScalarWhereInput | english_word_change_logScalarWhereInput[]
  }

  export type media_creatorUpdateManyWithoutEnglish_wordNestedInput = {
    create?: XOR<media_creatorCreateWithoutEnglish_wordInput, media_creatorUncheckedCreateWithoutEnglish_wordInput> | media_creatorCreateWithoutEnglish_wordInput[] | media_creatorUncheckedCreateWithoutEnglish_wordInput[]
    connectOrCreate?: media_creatorCreateOrConnectWithoutEnglish_wordInput | media_creatorCreateOrConnectWithoutEnglish_wordInput[]
    upsert?: media_creatorUpsertWithWhereUniqueWithoutEnglish_wordInput | media_creatorUpsertWithWhereUniqueWithoutEnglish_wordInput[]
    createMany?: media_creatorCreateManyEnglish_wordInputEnvelope
    set?: media_creatorWhereUniqueInput | media_creatorWhereUniqueInput[]
    disconnect?: media_creatorWhereUniqueInput | media_creatorWhereUniqueInput[]
    delete?: media_creatorWhereUniqueInput | media_creatorWhereUniqueInput[]
    connect?: media_creatorWhereUniqueInput | media_creatorWhereUniqueInput[]
    update?: media_creatorUpdateWithWhereUniqueWithoutEnglish_wordInput | media_creatorUpdateWithWhereUniqueWithoutEnglish_wordInput[]
    updateMany?: media_creatorUpdateManyWithWhereWithoutEnglish_wordInput | media_creatorUpdateManyWithWhereWithoutEnglish_wordInput[]
    deleteMany?: media_creatorScalarWhereInput | media_creatorScalarWhereInput[]
  }

  export type dictionary_wordUncheckedUpdateManyWithoutEnglish_wordNestedInput = {
    create?: XOR<dictionary_wordCreateWithoutEnglish_wordInput, dictionary_wordUncheckedCreateWithoutEnglish_wordInput> | dictionary_wordCreateWithoutEnglish_wordInput[] | dictionary_wordUncheckedCreateWithoutEnglish_wordInput[]
    connectOrCreate?: dictionary_wordCreateOrConnectWithoutEnglish_wordInput | dictionary_wordCreateOrConnectWithoutEnglish_wordInput[]
    upsert?: dictionary_wordUpsertWithWhereUniqueWithoutEnglish_wordInput | dictionary_wordUpsertWithWhereUniqueWithoutEnglish_wordInput[]
    createMany?: dictionary_wordCreateManyEnglish_wordInputEnvelope
    set?: dictionary_wordWhereUniqueInput | dictionary_wordWhereUniqueInput[]
    disconnect?: dictionary_wordWhereUniqueInput | dictionary_wordWhereUniqueInput[]
    delete?: dictionary_wordWhereUniqueInput | dictionary_wordWhereUniqueInput[]
    connect?: dictionary_wordWhereUniqueInput | dictionary_wordWhereUniqueInput[]
    update?: dictionary_wordUpdateWithWhereUniqueWithoutEnglish_wordInput | dictionary_wordUpdateWithWhereUniqueWithoutEnglish_wordInput[]
    updateMany?: dictionary_wordUpdateManyWithWhereWithoutEnglish_wordInput | dictionary_wordUpdateManyWithWhereWithoutEnglish_wordInput[]
    deleteMany?: dictionary_wordScalarWhereInput | dictionary_wordScalarWhereInput[]
  }

  export type english_word_change_logUncheckedUpdateManyWithoutEnglish_wordNestedInput = {
    create?: XOR<english_word_change_logCreateWithoutEnglish_wordInput, english_word_change_logUncheckedCreateWithoutEnglish_wordInput> | english_word_change_logCreateWithoutEnglish_wordInput[] | english_word_change_logUncheckedCreateWithoutEnglish_wordInput[]
    connectOrCreate?: english_word_change_logCreateOrConnectWithoutEnglish_wordInput | english_word_change_logCreateOrConnectWithoutEnglish_wordInput[]
    upsert?: english_word_change_logUpsertWithWhereUniqueWithoutEnglish_wordInput | english_word_change_logUpsertWithWhereUniqueWithoutEnglish_wordInput[]
    createMany?: english_word_change_logCreateManyEnglish_wordInputEnvelope
    set?: english_word_change_logWhereUniqueInput | english_word_change_logWhereUniqueInput[]
    disconnect?: english_word_change_logWhereUniqueInput | english_word_change_logWhereUniqueInput[]
    delete?: english_word_change_logWhereUniqueInput | english_word_change_logWhereUniqueInput[]
    connect?: english_word_change_logWhereUniqueInput | english_word_change_logWhereUniqueInput[]
    update?: english_word_change_logUpdateWithWhereUniqueWithoutEnglish_wordInput | english_word_change_logUpdateWithWhereUniqueWithoutEnglish_wordInput[]
    updateMany?: english_word_change_logUpdateManyWithWhereWithoutEnglish_wordInput | english_word_change_logUpdateManyWithWhereWithoutEnglish_wordInput[]
    deleteMany?: english_word_change_logScalarWhereInput | english_word_change_logScalarWhereInput[]
  }

  export type media_creatorUncheckedUpdateManyWithoutEnglish_wordNestedInput = {
    create?: XOR<media_creatorCreateWithoutEnglish_wordInput, media_creatorUncheckedCreateWithoutEnglish_wordInput> | media_creatorCreateWithoutEnglish_wordInput[] | media_creatorUncheckedCreateWithoutEnglish_wordInput[]
    connectOrCreate?: media_creatorCreateOrConnectWithoutEnglish_wordInput | media_creatorCreateOrConnectWithoutEnglish_wordInput[]
    upsert?: media_creatorUpsertWithWhereUniqueWithoutEnglish_wordInput | media_creatorUpsertWithWhereUniqueWithoutEnglish_wordInput[]
    createMany?: media_creatorCreateManyEnglish_wordInputEnvelope
    set?: media_creatorWhereUniqueInput | media_creatorWhereUniqueInput[]
    disconnect?: media_creatorWhereUniqueInput | media_creatorWhereUniqueInput[]
    delete?: media_creatorWhereUniqueInput | media_creatorWhereUniqueInput[]
    connect?: media_creatorWhereUniqueInput | media_creatorWhereUniqueInput[]
    update?: media_creatorUpdateWithWhereUniqueWithoutEnglish_wordInput | media_creatorUpdateWithWhereUniqueWithoutEnglish_wordInput[]
    updateMany?: media_creatorUpdateManyWithWhereWithoutEnglish_wordInput | media_creatorUpdateManyWithWhereWithoutEnglish_wordInput[]
    deleteMany?: media_creatorScalarWhereInput | media_creatorScalarWhereInput[]
  }

  export type english_wordCreateNestedOneWithoutEnglish_word_change_logInput = {
    create?: XOR<english_wordCreateWithoutEnglish_word_change_logInput, english_wordUncheckedCreateWithoutEnglish_word_change_logInput>
    connectOrCreate?: english_wordCreateOrConnectWithoutEnglish_word_change_logInput
    connect?: english_wordWhereUniqueInput
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type english_wordUpdateOneRequiredWithoutEnglish_word_change_logNestedInput = {
    create?: XOR<english_wordCreateWithoutEnglish_word_change_logInput, english_wordUncheckedCreateWithoutEnglish_word_change_logInput>
    connectOrCreate?: english_wordCreateOrConnectWithoutEnglish_word_change_logInput
    upsert?: english_wordUpsertWithoutEnglish_word_change_logInput
    connect?: english_wordWhereUniqueInput
    update?: XOR<XOR<english_wordUpdateToOneWithWhereWithoutEnglish_word_change_logInput, english_wordUpdateWithoutEnglish_word_change_logInput>, english_wordUncheckedUpdateWithoutEnglish_word_change_logInput>
  }

  export type english_wordCreateNestedOneWithoutMedia_creatorInput = {
    create?: XOR<english_wordCreateWithoutMedia_creatorInput, english_wordUncheckedCreateWithoutMedia_creatorInput>
    connectOrCreate?: english_wordCreateOrConnectWithoutMedia_creatorInput
    connect?: english_wordWhereUniqueInput
  }

  export type english_wordUpdateOneRequiredWithoutMedia_creatorNestedInput = {
    create?: XOR<english_wordCreateWithoutMedia_creatorInput, english_wordUncheckedCreateWithoutMedia_creatorInput>
    connectOrCreate?: english_wordCreateOrConnectWithoutMedia_creatorInput
    upsert?: english_wordUpsertWithoutMedia_creatorInput
    connect?: english_wordWhereUniqueInput
    update?: XOR<XOR<english_wordUpdateToOneWithWhereWithoutMedia_creatorInput, english_wordUpdateWithoutMedia_creatorInput>, english_wordUncheckedUpdateWithoutMedia_creatorInput>
  }

  export type audio_fileCreateNestedManyWithoutUserInput = {
    create?: XOR<audio_fileCreateWithoutUserInput, audio_fileUncheckedCreateWithoutUserInput> | audio_fileCreateWithoutUserInput[] | audio_fileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: audio_fileCreateOrConnectWithoutUserInput | audio_fileCreateOrConnectWithoutUserInput[]
    createMany?: audio_fileCreateManyUserInputEnvelope
    connect?: audio_fileWhereUniqueInput | audio_fileWhereUniqueInput[]
  }

  export type user_configCreateNestedOneWithoutUserInput = {
    create?: XOR<user_configCreateWithoutUserInput, user_configUncheckedCreateWithoutUserInput>
    connectOrCreate?: user_configCreateOrConnectWithoutUserInput
    connect?: user_configWhereUniqueInput
  }

  export type audio_fileUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<audio_fileCreateWithoutUserInput, audio_fileUncheckedCreateWithoutUserInput> | audio_fileCreateWithoutUserInput[] | audio_fileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: audio_fileCreateOrConnectWithoutUserInput | audio_fileCreateOrConnectWithoutUserInput[]
    createMany?: audio_fileCreateManyUserInputEnvelope
    connect?: audio_fileWhereUniqueInput | audio_fileWhereUniqueInput[]
  }

  export type user_configUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<user_configCreateWithoutUserInput, user_configUncheckedCreateWithoutUserInput>
    connectOrCreate?: user_configCreateOrConnectWithoutUserInput
    connect?: user_configWhereUniqueInput
  }

  export type audio_fileUpdateManyWithoutUserNestedInput = {
    create?: XOR<audio_fileCreateWithoutUserInput, audio_fileUncheckedCreateWithoutUserInput> | audio_fileCreateWithoutUserInput[] | audio_fileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: audio_fileCreateOrConnectWithoutUserInput | audio_fileCreateOrConnectWithoutUserInput[]
    upsert?: audio_fileUpsertWithWhereUniqueWithoutUserInput | audio_fileUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: audio_fileCreateManyUserInputEnvelope
    set?: audio_fileWhereUniqueInput | audio_fileWhereUniqueInput[]
    disconnect?: audio_fileWhereUniqueInput | audio_fileWhereUniqueInput[]
    delete?: audio_fileWhereUniqueInput | audio_fileWhereUniqueInput[]
    connect?: audio_fileWhereUniqueInput | audio_fileWhereUniqueInput[]
    update?: audio_fileUpdateWithWhereUniqueWithoutUserInput | audio_fileUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: audio_fileUpdateManyWithWhereWithoutUserInput | audio_fileUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: audio_fileScalarWhereInput | audio_fileScalarWhereInput[]
  }

  export type user_configUpdateOneWithoutUserNestedInput = {
    create?: XOR<user_configCreateWithoutUserInput, user_configUncheckedCreateWithoutUserInput>
    connectOrCreate?: user_configCreateOrConnectWithoutUserInput
    upsert?: user_configUpsertWithoutUserInput
    disconnect?: user_configWhereInput | boolean
    delete?: user_configWhereInput | boolean
    connect?: user_configWhereUniqueInput
    update?: XOR<XOR<user_configUpdateToOneWithWhereWithoutUserInput, user_configUpdateWithoutUserInput>, user_configUncheckedUpdateWithoutUserInput>
  }

  export type audio_fileUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<audio_fileCreateWithoutUserInput, audio_fileUncheckedCreateWithoutUserInput> | audio_fileCreateWithoutUserInput[] | audio_fileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: audio_fileCreateOrConnectWithoutUserInput | audio_fileCreateOrConnectWithoutUserInput[]
    upsert?: audio_fileUpsertWithWhereUniqueWithoutUserInput | audio_fileUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: audio_fileCreateManyUserInputEnvelope
    set?: audio_fileWhereUniqueInput | audio_fileWhereUniqueInput[]
    disconnect?: audio_fileWhereUniqueInput | audio_fileWhereUniqueInput[]
    delete?: audio_fileWhereUniqueInput | audio_fileWhereUniqueInput[]
    connect?: audio_fileWhereUniqueInput | audio_fileWhereUniqueInput[]
    update?: audio_fileUpdateWithWhereUniqueWithoutUserInput | audio_fileUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: audio_fileUpdateManyWithWhereWithoutUserInput | audio_fileUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: audio_fileScalarWhereInput | audio_fileScalarWhereInput[]
  }

  export type user_configUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<user_configCreateWithoutUserInput, user_configUncheckedCreateWithoutUserInput>
    connectOrCreate?: user_configCreateOrConnectWithoutUserInput
    upsert?: user_configUpsertWithoutUserInput
    disconnect?: user_configWhereInput | boolean
    delete?: user_configWhereInput | boolean
    connect?: user_configWhereUniqueInput
    update?: XOR<XOR<user_configUpdateToOneWithWhereWithoutUserInput, user_configUpdateWithoutUserInput>, user_configUncheckedUpdateWithoutUserInput>
  }

  export type userCreateNestedOneWithoutUser_configInput = {
    create?: XOR<userCreateWithoutUser_configInput, userUncheckedCreateWithoutUser_configInput>
    connectOrCreate?: userCreateOrConnectWithoutUser_configInput
    connect?: userWhereUniqueInput
  }

  export type userUpdateOneRequiredWithoutUser_configNestedInput = {
    create?: XOR<userCreateWithoutUser_configInput, userUncheckedCreateWithoutUser_configInput>
    connectOrCreate?: userCreateOrConnectWithoutUser_configInput
    upsert?: userUpsertWithoutUser_configInput
    connect?: userWhereUniqueInput
    update?: XOR<XOR<userUpdateToOneWithWhereWithoutUser_configInput, userUpdateWithoutUser_configInput>, userUncheckedUpdateWithoutUser_configInput>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | null
    notIn?: bigint[] | number[] | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type userCreateWithoutAudio_fileInput = {
    id?: bigint | number
    userAccount: string
    userPassword: string
    unionId?: string | null
    mpOpenId?: string | null
    userName?: string | null
    userAvatar?: string | null
    userProfile?: string | null
    userRole?: string
    createTime?: Date | string
    updateTime?: Date | string
    isDelete?: number
    user_config?: user_configCreateNestedOneWithoutUserInput
  }

  export type userUncheckedCreateWithoutAudio_fileInput = {
    id?: bigint | number
    userAccount: string
    userPassword: string
    unionId?: string | null
    mpOpenId?: string | null
    userName?: string | null
    userAvatar?: string | null
    userProfile?: string | null
    userRole?: string
    createTime?: Date | string
    updateTime?: Date | string
    isDelete?: number
    user_config?: user_configUncheckedCreateNestedOneWithoutUserInput
  }

  export type userCreateOrConnectWithoutAudio_fileInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutAudio_fileInput, userUncheckedCreateWithoutAudio_fileInput>
  }

  export type userUpsertWithoutAudio_fileInput = {
    update: XOR<userUpdateWithoutAudio_fileInput, userUncheckedUpdateWithoutAudio_fileInput>
    create: XOR<userCreateWithoutAudio_fileInput, userUncheckedCreateWithoutAudio_fileInput>
    where?: userWhereInput
  }

  export type userUpdateToOneWithWhereWithoutAudio_fileInput = {
    where?: userWhereInput
    data: XOR<userUpdateWithoutAudio_fileInput, userUncheckedUpdateWithoutAudio_fileInput>
  }

  export type userUpdateWithoutAudio_fileInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userAccount?: StringFieldUpdateOperationsInput | string
    userPassword?: StringFieldUpdateOperationsInput | string
    unionId?: NullableStringFieldUpdateOperationsInput | string | null
    mpOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    userName?: NullableStringFieldUpdateOperationsInput | string | null
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    userProfile?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    updateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    isDelete?: IntFieldUpdateOperationsInput | number
    user_config?: user_configUpdateOneWithoutUserNestedInput
  }

  export type userUncheckedUpdateWithoutAudio_fileInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userAccount?: StringFieldUpdateOperationsInput | string
    userPassword?: StringFieldUpdateOperationsInput | string
    unionId?: NullableStringFieldUpdateOperationsInput | string | null
    mpOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    userName?: NullableStringFieldUpdateOperationsInput | string | null
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    userProfile?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    updateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    isDelete?: IntFieldUpdateOperationsInput | number
    user_config?: user_configUncheckedUpdateOneWithoutUserNestedInput
  }

  export type english_dictionaryCreateWithoutDictionary_wordInput = {
    id: bigint | number
    name?: string | null
    description?: string | null
    image_url?: string | null
    author?: string | null
    isbn?: string | null
    publication_date?: Date | string | null
    publisher?: string | null
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: boolean | null
    total_words?: number | null
    published_words?: number | null
    approved_words?: number | null
  }

  export type english_dictionaryUncheckedCreateWithoutDictionary_wordInput = {
    id: bigint | number
    name?: string | null
    description?: string | null
    image_url?: string | null
    author?: string | null
    isbn?: string | null
    publication_date?: Date | string | null
    publisher?: string | null
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: boolean | null
    total_words?: number | null
    published_words?: number | null
    approved_words?: number | null
  }

  export type english_dictionaryCreateOrConnectWithoutDictionary_wordInput = {
    where: english_dictionaryWhereUniqueInput
    create: XOR<english_dictionaryCreateWithoutDictionary_wordInput, english_dictionaryUncheckedCreateWithoutDictionary_wordInput>
  }

  export type english_wordCreateWithoutDictionary_wordInput = {
    id: bigint | number
    word_head?: string | null
    thumbnail?: string | null
    info?: NullableJsonNullValueInput | InputJsonValue
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: boolean | null
    status?: string | null
    manual_score?: number | null
    ai_score?: number | null
    reviewer?: bigint | number | null
    english_word_change_log?: english_word_change_logCreateNestedManyWithoutEnglish_wordInput
    media_creator?: media_creatorCreateNestedManyWithoutEnglish_wordInput
  }

  export type english_wordUncheckedCreateWithoutDictionary_wordInput = {
    id: bigint | number
    word_head?: string | null
    thumbnail?: string | null
    info?: NullableJsonNullValueInput | InputJsonValue
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: boolean | null
    status?: string | null
    manual_score?: number | null
    ai_score?: number | null
    reviewer?: bigint | number | null
    english_word_change_log?: english_word_change_logUncheckedCreateNestedManyWithoutEnglish_wordInput
    media_creator?: media_creatorUncheckedCreateNestedManyWithoutEnglish_wordInput
  }

  export type english_wordCreateOrConnectWithoutDictionary_wordInput = {
    where: english_wordWhereUniqueInput
    create: XOR<english_wordCreateWithoutDictionary_wordInput, english_wordUncheckedCreateWithoutDictionary_wordInput>
  }

  export type english_dictionaryUpsertWithoutDictionary_wordInput = {
    update: XOR<english_dictionaryUpdateWithoutDictionary_wordInput, english_dictionaryUncheckedUpdateWithoutDictionary_wordInput>
    create: XOR<english_dictionaryCreateWithoutDictionary_wordInput, english_dictionaryUncheckedCreateWithoutDictionary_wordInput>
    where?: english_dictionaryWhereInput
  }

  export type english_dictionaryUpdateToOneWithWhereWithoutDictionary_wordInput = {
    where?: english_dictionaryWhereInput
    data: XOR<english_dictionaryUpdateWithoutDictionary_wordInput, english_dictionaryUncheckedUpdateWithoutDictionary_wordInput>
  }

  export type english_dictionaryUpdateWithoutDictionary_wordInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    author?: NullableStringFieldUpdateOperationsInput | string | null
    isbn?: NullableStringFieldUpdateOperationsInput | string | null
    publication_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publisher?: NullableStringFieldUpdateOperationsInput | string | null
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    total_words?: NullableIntFieldUpdateOperationsInput | number | null
    published_words?: NullableIntFieldUpdateOperationsInput | number | null
    approved_words?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type english_dictionaryUncheckedUpdateWithoutDictionary_wordInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    author?: NullableStringFieldUpdateOperationsInput | string | null
    isbn?: NullableStringFieldUpdateOperationsInput | string | null
    publication_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publisher?: NullableStringFieldUpdateOperationsInput | string | null
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    total_words?: NullableIntFieldUpdateOperationsInput | number | null
    published_words?: NullableIntFieldUpdateOperationsInput | number | null
    approved_words?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type english_wordUpsertWithoutDictionary_wordInput = {
    update: XOR<english_wordUpdateWithoutDictionary_wordInput, english_wordUncheckedUpdateWithoutDictionary_wordInput>
    create: XOR<english_wordCreateWithoutDictionary_wordInput, english_wordUncheckedCreateWithoutDictionary_wordInput>
    where?: english_wordWhereInput
  }

  export type english_wordUpdateToOneWithWhereWithoutDictionary_wordInput = {
    where?: english_wordWhereInput
    data: XOR<english_wordUpdateWithoutDictionary_wordInput, english_wordUncheckedUpdateWithoutDictionary_wordInput>
  }

  export type english_wordUpdateWithoutDictionary_wordInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    word_head?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    info?: NullableJsonNullValueInput | InputJsonValue
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    manual_score?: NullableIntFieldUpdateOperationsInput | number | null
    ai_score?: NullableIntFieldUpdateOperationsInput | number | null
    reviewer?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    english_word_change_log?: english_word_change_logUpdateManyWithoutEnglish_wordNestedInput
    media_creator?: media_creatorUpdateManyWithoutEnglish_wordNestedInput
  }

  export type english_wordUncheckedUpdateWithoutDictionary_wordInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    word_head?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    info?: NullableJsonNullValueInput | InputJsonValue
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    manual_score?: NullableIntFieldUpdateOperationsInput | number | null
    ai_score?: NullableIntFieldUpdateOperationsInput | number | null
    reviewer?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    english_word_change_log?: english_word_change_logUncheckedUpdateManyWithoutEnglish_wordNestedInput
    media_creator?: media_creatorUncheckedUpdateManyWithoutEnglish_wordNestedInput
  }

  export type dictionary_wordCreateWithoutEnglish_dictionaryInput = {
    created_at?: Date | string | null
    id?: bigint | number | null
    english_word: english_wordCreateNestedOneWithoutDictionary_wordInput
  }

  export type dictionary_wordUncheckedCreateWithoutEnglish_dictionaryInput = {
    word_id: bigint | number
    created_at?: Date | string | null
    id?: bigint | number | null
  }

  export type dictionary_wordCreateOrConnectWithoutEnglish_dictionaryInput = {
    where: dictionary_wordWhereUniqueInput
    create: XOR<dictionary_wordCreateWithoutEnglish_dictionaryInput, dictionary_wordUncheckedCreateWithoutEnglish_dictionaryInput>
  }

  export type dictionary_wordCreateManyEnglish_dictionaryInputEnvelope = {
    data: dictionary_wordCreateManyEnglish_dictionaryInput | dictionary_wordCreateManyEnglish_dictionaryInput[]
    skipDuplicates?: boolean
  }

  export type dictionary_wordUpsertWithWhereUniqueWithoutEnglish_dictionaryInput = {
    where: dictionary_wordWhereUniqueInput
    update: XOR<dictionary_wordUpdateWithoutEnglish_dictionaryInput, dictionary_wordUncheckedUpdateWithoutEnglish_dictionaryInput>
    create: XOR<dictionary_wordCreateWithoutEnglish_dictionaryInput, dictionary_wordUncheckedCreateWithoutEnglish_dictionaryInput>
  }

  export type dictionary_wordUpdateWithWhereUniqueWithoutEnglish_dictionaryInput = {
    where: dictionary_wordWhereUniqueInput
    data: XOR<dictionary_wordUpdateWithoutEnglish_dictionaryInput, dictionary_wordUncheckedUpdateWithoutEnglish_dictionaryInput>
  }

  export type dictionary_wordUpdateManyWithWhereWithoutEnglish_dictionaryInput = {
    where: dictionary_wordScalarWhereInput
    data: XOR<dictionary_wordUpdateManyMutationInput, dictionary_wordUncheckedUpdateManyWithoutEnglish_dictionaryInput>
  }

  export type dictionary_wordScalarWhereInput = {
    AND?: dictionary_wordScalarWhereInput | dictionary_wordScalarWhereInput[]
    OR?: dictionary_wordScalarWhereInput[]
    NOT?: dictionary_wordScalarWhereInput | dictionary_wordScalarWhereInput[]
    dictionary_id?: BigIntFilter<"dictionary_word"> | bigint | number
    word_id?: BigIntFilter<"dictionary_word"> | bigint | number
    created_at?: DateTimeNullableFilter<"dictionary_word"> | Date | string | null
    id?: BigIntNullableFilter<"dictionary_word"> | bigint | number | null
  }

  export type dictionary_wordCreateWithoutEnglish_wordInput = {
    created_at?: Date | string | null
    id?: bigint | number | null
    english_dictionary: english_dictionaryCreateNestedOneWithoutDictionary_wordInput
  }

  export type dictionary_wordUncheckedCreateWithoutEnglish_wordInput = {
    dictionary_id: bigint | number
    created_at?: Date | string | null
    id?: bigint | number | null
  }

  export type dictionary_wordCreateOrConnectWithoutEnglish_wordInput = {
    where: dictionary_wordWhereUniqueInput
    create: XOR<dictionary_wordCreateWithoutEnglish_wordInput, dictionary_wordUncheckedCreateWithoutEnglish_wordInput>
  }

  export type dictionary_wordCreateManyEnglish_wordInputEnvelope = {
    data: dictionary_wordCreateManyEnglish_wordInput | dictionary_wordCreateManyEnglish_wordInput[]
    skipDuplicates?: boolean
  }

  export type english_word_change_logCreateWithoutEnglish_wordInput = {
    id: bigint | number
    field_name: string
    old_value?: string | null
    new_value?: string | null
    change_time?: Date | string
    changed_by?: bigint | number | null
  }

  export type english_word_change_logUncheckedCreateWithoutEnglish_wordInput = {
    id: bigint | number
    field_name: string
    old_value?: string | null
    new_value?: string | null
    change_time?: Date | string
    changed_by?: bigint | number | null
  }

  export type english_word_change_logCreateOrConnectWithoutEnglish_wordInput = {
    where: english_word_change_logWhereUniqueInput
    create: XOR<english_word_change_logCreateWithoutEnglish_wordInput, english_word_change_logUncheckedCreateWithoutEnglish_wordInput>
  }

  export type english_word_change_logCreateManyEnglish_wordInputEnvelope = {
    data: english_word_change_logCreateManyEnglish_wordInput | english_word_change_logCreateManyEnglish_wordInput[]
    skipDuplicates?: boolean
  }

  export type media_creatorCreateWithoutEnglish_wordInput = {
    id?: bigint | number
    media_type: string
    media_url?: string | null
    creator_id?: bigint | number | null
    info?: string | null
    created_at?: Date | string | null
  }

  export type media_creatorUncheckedCreateWithoutEnglish_wordInput = {
    id?: bigint | number
    media_type: string
    media_url?: string | null
    creator_id?: bigint | number | null
    info?: string | null
    created_at?: Date | string | null
  }

  export type media_creatorCreateOrConnectWithoutEnglish_wordInput = {
    where: media_creatorWhereUniqueInput
    create: XOR<media_creatorCreateWithoutEnglish_wordInput, media_creatorUncheckedCreateWithoutEnglish_wordInput>
  }

  export type media_creatorCreateManyEnglish_wordInputEnvelope = {
    data: media_creatorCreateManyEnglish_wordInput | media_creatorCreateManyEnglish_wordInput[]
    skipDuplicates?: boolean
  }

  export type dictionary_wordUpsertWithWhereUniqueWithoutEnglish_wordInput = {
    where: dictionary_wordWhereUniqueInput
    update: XOR<dictionary_wordUpdateWithoutEnglish_wordInput, dictionary_wordUncheckedUpdateWithoutEnglish_wordInput>
    create: XOR<dictionary_wordCreateWithoutEnglish_wordInput, dictionary_wordUncheckedCreateWithoutEnglish_wordInput>
  }

  export type dictionary_wordUpdateWithWhereUniqueWithoutEnglish_wordInput = {
    where: dictionary_wordWhereUniqueInput
    data: XOR<dictionary_wordUpdateWithoutEnglish_wordInput, dictionary_wordUncheckedUpdateWithoutEnglish_wordInput>
  }

  export type dictionary_wordUpdateManyWithWhereWithoutEnglish_wordInput = {
    where: dictionary_wordScalarWhereInput
    data: XOR<dictionary_wordUpdateManyMutationInput, dictionary_wordUncheckedUpdateManyWithoutEnglish_wordInput>
  }

  export type english_word_change_logUpsertWithWhereUniqueWithoutEnglish_wordInput = {
    where: english_word_change_logWhereUniqueInput
    update: XOR<english_word_change_logUpdateWithoutEnglish_wordInput, english_word_change_logUncheckedUpdateWithoutEnglish_wordInput>
    create: XOR<english_word_change_logCreateWithoutEnglish_wordInput, english_word_change_logUncheckedCreateWithoutEnglish_wordInput>
  }

  export type english_word_change_logUpdateWithWhereUniqueWithoutEnglish_wordInput = {
    where: english_word_change_logWhereUniqueInput
    data: XOR<english_word_change_logUpdateWithoutEnglish_wordInput, english_word_change_logUncheckedUpdateWithoutEnglish_wordInput>
  }

  export type english_word_change_logUpdateManyWithWhereWithoutEnglish_wordInput = {
    where: english_word_change_logScalarWhereInput
    data: XOR<english_word_change_logUpdateManyMutationInput, english_word_change_logUncheckedUpdateManyWithoutEnglish_wordInput>
  }

  export type english_word_change_logScalarWhereInput = {
    AND?: english_word_change_logScalarWhereInput | english_word_change_logScalarWhereInput[]
    OR?: english_word_change_logScalarWhereInput[]
    NOT?: english_word_change_logScalarWhereInput | english_word_change_logScalarWhereInput[]
    id?: BigIntFilter<"english_word_change_log"> | bigint | number
    english_word_id?: BigIntFilter<"english_word_change_log"> | bigint | number
    field_name?: StringFilter<"english_word_change_log"> | string
    old_value?: StringNullableFilter<"english_word_change_log"> | string | null
    new_value?: StringNullableFilter<"english_word_change_log"> | string | null
    change_time?: DateTimeFilter<"english_word_change_log"> | Date | string
    changed_by?: BigIntNullableFilter<"english_word_change_log"> | bigint | number | null
  }

  export type media_creatorUpsertWithWhereUniqueWithoutEnglish_wordInput = {
    where: media_creatorWhereUniqueInput
    update: XOR<media_creatorUpdateWithoutEnglish_wordInput, media_creatorUncheckedUpdateWithoutEnglish_wordInput>
    create: XOR<media_creatorCreateWithoutEnglish_wordInput, media_creatorUncheckedCreateWithoutEnglish_wordInput>
  }

  export type media_creatorUpdateWithWhereUniqueWithoutEnglish_wordInput = {
    where: media_creatorWhereUniqueInput
    data: XOR<media_creatorUpdateWithoutEnglish_wordInput, media_creatorUncheckedUpdateWithoutEnglish_wordInput>
  }

  export type media_creatorUpdateManyWithWhereWithoutEnglish_wordInput = {
    where: media_creatorScalarWhereInput
    data: XOR<media_creatorUpdateManyMutationInput, media_creatorUncheckedUpdateManyWithoutEnglish_wordInput>
  }

  export type media_creatorScalarWhereInput = {
    AND?: media_creatorScalarWhereInput | media_creatorScalarWhereInput[]
    OR?: media_creatorScalarWhereInput[]
    NOT?: media_creatorScalarWhereInput | media_creatorScalarWhereInput[]
    id?: BigIntFilter<"media_creator"> | bigint | number
    word_id?: BigIntFilter<"media_creator"> | bigint | number
    media_type?: StringFilter<"media_creator"> | string
    media_url?: StringNullableFilter<"media_creator"> | string | null
    creator_id?: BigIntNullableFilter<"media_creator"> | bigint | number | null
    info?: StringNullableFilter<"media_creator"> | string | null
    created_at?: DateTimeNullableFilter<"media_creator"> | Date | string | null
  }

  export type english_wordCreateWithoutEnglish_word_change_logInput = {
    id: bigint | number
    word_head?: string | null
    thumbnail?: string | null
    info?: NullableJsonNullValueInput | InputJsonValue
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: boolean | null
    status?: string | null
    manual_score?: number | null
    ai_score?: number | null
    reviewer?: bigint | number | null
    dictionary_word?: dictionary_wordCreateNestedManyWithoutEnglish_wordInput
    media_creator?: media_creatorCreateNestedManyWithoutEnglish_wordInput
  }

  export type english_wordUncheckedCreateWithoutEnglish_word_change_logInput = {
    id: bigint | number
    word_head?: string | null
    thumbnail?: string | null
    info?: NullableJsonNullValueInput | InputJsonValue
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: boolean | null
    status?: string | null
    manual_score?: number | null
    ai_score?: number | null
    reviewer?: bigint | number | null
    dictionary_word?: dictionary_wordUncheckedCreateNestedManyWithoutEnglish_wordInput
    media_creator?: media_creatorUncheckedCreateNestedManyWithoutEnglish_wordInput
  }

  export type english_wordCreateOrConnectWithoutEnglish_word_change_logInput = {
    where: english_wordWhereUniqueInput
    create: XOR<english_wordCreateWithoutEnglish_word_change_logInput, english_wordUncheckedCreateWithoutEnglish_word_change_logInput>
  }

  export type english_wordUpsertWithoutEnglish_word_change_logInput = {
    update: XOR<english_wordUpdateWithoutEnglish_word_change_logInput, english_wordUncheckedUpdateWithoutEnglish_word_change_logInput>
    create: XOR<english_wordCreateWithoutEnglish_word_change_logInput, english_wordUncheckedCreateWithoutEnglish_word_change_logInput>
    where?: english_wordWhereInput
  }

  export type english_wordUpdateToOneWithWhereWithoutEnglish_word_change_logInput = {
    where?: english_wordWhereInput
    data: XOR<english_wordUpdateWithoutEnglish_word_change_logInput, english_wordUncheckedUpdateWithoutEnglish_word_change_logInput>
  }

  export type english_wordUpdateWithoutEnglish_word_change_logInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    word_head?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    info?: NullableJsonNullValueInput | InputJsonValue
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    manual_score?: NullableIntFieldUpdateOperationsInput | number | null
    ai_score?: NullableIntFieldUpdateOperationsInput | number | null
    reviewer?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    dictionary_word?: dictionary_wordUpdateManyWithoutEnglish_wordNestedInput
    media_creator?: media_creatorUpdateManyWithoutEnglish_wordNestedInput
  }

  export type english_wordUncheckedUpdateWithoutEnglish_word_change_logInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    word_head?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    info?: NullableJsonNullValueInput | InputJsonValue
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    manual_score?: NullableIntFieldUpdateOperationsInput | number | null
    ai_score?: NullableIntFieldUpdateOperationsInput | number | null
    reviewer?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    dictionary_word?: dictionary_wordUncheckedUpdateManyWithoutEnglish_wordNestedInput
    media_creator?: media_creatorUncheckedUpdateManyWithoutEnglish_wordNestedInput
  }

  export type english_wordCreateWithoutMedia_creatorInput = {
    id: bigint | number
    word_head?: string | null
    thumbnail?: string | null
    info?: NullableJsonNullValueInput | InputJsonValue
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: boolean | null
    status?: string | null
    manual_score?: number | null
    ai_score?: number | null
    reviewer?: bigint | number | null
    dictionary_word?: dictionary_wordCreateNestedManyWithoutEnglish_wordInput
    english_word_change_log?: english_word_change_logCreateNestedManyWithoutEnglish_wordInput
  }

  export type english_wordUncheckedCreateWithoutMedia_creatorInput = {
    id: bigint | number
    word_head?: string | null
    thumbnail?: string | null
    info?: NullableJsonNullValueInput | InputJsonValue
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: boolean | null
    status?: string | null
    manual_score?: number | null
    ai_score?: number | null
    reviewer?: bigint | number | null
    dictionary_word?: dictionary_wordUncheckedCreateNestedManyWithoutEnglish_wordInput
    english_word_change_log?: english_word_change_logUncheckedCreateNestedManyWithoutEnglish_wordInput
  }

  export type english_wordCreateOrConnectWithoutMedia_creatorInput = {
    where: english_wordWhereUniqueInput
    create: XOR<english_wordCreateWithoutMedia_creatorInput, english_wordUncheckedCreateWithoutMedia_creatorInput>
  }

  export type english_wordUpsertWithoutMedia_creatorInput = {
    update: XOR<english_wordUpdateWithoutMedia_creatorInput, english_wordUncheckedUpdateWithoutMedia_creatorInput>
    create: XOR<english_wordCreateWithoutMedia_creatorInput, english_wordUncheckedCreateWithoutMedia_creatorInput>
    where?: english_wordWhereInput
  }

  export type english_wordUpdateToOneWithWhereWithoutMedia_creatorInput = {
    where?: english_wordWhereInput
    data: XOR<english_wordUpdateWithoutMedia_creatorInput, english_wordUncheckedUpdateWithoutMedia_creatorInput>
  }

  export type english_wordUpdateWithoutMedia_creatorInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    word_head?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    info?: NullableJsonNullValueInput | InputJsonValue
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    manual_score?: NullableIntFieldUpdateOperationsInput | number | null
    ai_score?: NullableIntFieldUpdateOperationsInput | number | null
    reviewer?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    dictionary_word?: dictionary_wordUpdateManyWithoutEnglish_wordNestedInput
    english_word_change_log?: english_word_change_logUpdateManyWithoutEnglish_wordNestedInput
  }

  export type english_wordUncheckedUpdateWithoutMedia_creatorInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    word_head?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    info?: NullableJsonNullValueInput | InputJsonValue
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableBoolFieldUpdateOperationsInput | boolean | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    manual_score?: NullableIntFieldUpdateOperationsInput | number | null
    ai_score?: NullableIntFieldUpdateOperationsInput | number | null
    reviewer?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    dictionary_word?: dictionary_wordUncheckedUpdateManyWithoutEnglish_wordNestedInput
    english_word_change_log?: english_word_change_logUncheckedUpdateManyWithoutEnglish_wordNestedInput
  }

  export type audio_fileCreateWithoutUserInput = {
    id?: bigint | number
    path?: string | null
    content?: string | null
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: number | null
    status?: string
    name?: string
  }

  export type audio_fileUncheckedCreateWithoutUserInput = {
    id?: bigint | number
    path?: string | null
    content?: string | null
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: number | null
    status?: string
    name?: string
  }

  export type audio_fileCreateOrConnectWithoutUserInput = {
    where: audio_fileWhereUniqueInput
    create: XOR<audio_fileCreateWithoutUserInput, audio_fileUncheckedCreateWithoutUserInput>
  }

  export type audio_fileCreateManyUserInputEnvelope = {
    data: audio_fileCreateManyUserInput | audio_fileCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type user_configCreateWithoutUserInput = {
    config_json: JsonNullValueInput | InputJsonValue
    update_time?: Date | string | null
  }

  export type user_configUncheckedCreateWithoutUserInput = {
    config_json: JsonNullValueInput | InputJsonValue
    update_time?: Date | string | null
  }

  export type user_configCreateOrConnectWithoutUserInput = {
    where: user_configWhereUniqueInput
    create: XOR<user_configCreateWithoutUserInput, user_configUncheckedCreateWithoutUserInput>
  }

  export type audio_fileUpsertWithWhereUniqueWithoutUserInput = {
    where: audio_fileWhereUniqueInput
    update: XOR<audio_fileUpdateWithoutUserInput, audio_fileUncheckedUpdateWithoutUserInput>
    create: XOR<audio_fileCreateWithoutUserInput, audio_fileUncheckedCreateWithoutUserInput>
  }

  export type audio_fileUpdateWithWhereUniqueWithoutUserInput = {
    where: audio_fileWhereUniqueInput
    data: XOR<audio_fileUpdateWithoutUserInput, audio_fileUncheckedUpdateWithoutUserInput>
  }

  export type audio_fileUpdateManyWithWhereWithoutUserInput = {
    where: audio_fileScalarWhereInput
    data: XOR<audio_fileUpdateManyMutationInput, audio_fileUncheckedUpdateManyWithoutUserInput>
  }

  export type audio_fileScalarWhereInput = {
    AND?: audio_fileScalarWhereInput | audio_fileScalarWhereInput[]
    OR?: audio_fileScalarWhereInput[]
    NOT?: audio_fileScalarWhereInput | audio_fileScalarWhereInput[]
    id?: BigIntFilter<"audio_file"> | bigint | number
    path?: StringNullableFilter<"audio_file"> | string | null
    content?: StringNullableFilter<"audio_file"> | string | null
    creator_id?: BigIntNullableFilter<"audio_file"> | bigint | number | null
    create_time?: DateTimeNullableFilter<"audio_file"> | Date | string | null
    update_time?: DateTimeNullableFilter<"audio_file"> | Date | string | null
    is_delete?: IntNullableFilter<"audio_file"> | number | null
    status?: StringFilter<"audio_file"> | string
    name?: StringFilter<"audio_file"> | string
  }

  export type user_configUpsertWithoutUserInput = {
    update: XOR<user_configUpdateWithoutUserInput, user_configUncheckedUpdateWithoutUserInput>
    create: XOR<user_configCreateWithoutUserInput, user_configUncheckedCreateWithoutUserInput>
    where?: user_configWhereInput
  }

  export type user_configUpdateToOneWithWhereWithoutUserInput = {
    where?: user_configWhereInput
    data: XOR<user_configUpdateWithoutUserInput, user_configUncheckedUpdateWithoutUserInput>
  }

  export type user_configUpdateWithoutUserInput = {
    config_json?: JsonNullValueInput | InputJsonValue
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type user_configUncheckedUpdateWithoutUserInput = {
    config_json?: JsonNullValueInput | InputJsonValue
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type userCreateWithoutUser_configInput = {
    id?: bigint | number
    userAccount: string
    userPassword: string
    unionId?: string | null
    mpOpenId?: string | null
    userName?: string | null
    userAvatar?: string | null
    userProfile?: string | null
    userRole?: string
    createTime?: Date | string
    updateTime?: Date | string
    isDelete?: number
    audio_file?: audio_fileCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateWithoutUser_configInput = {
    id?: bigint | number
    userAccount: string
    userPassword: string
    unionId?: string | null
    mpOpenId?: string | null
    userName?: string | null
    userAvatar?: string | null
    userProfile?: string | null
    userRole?: string
    createTime?: Date | string
    updateTime?: Date | string
    isDelete?: number
    audio_file?: audio_fileUncheckedCreateNestedManyWithoutUserInput
  }

  export type userCreateOrConnectWithoutUser_configInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutUser_configInput, userUncheckedCreateWithoutUser_configInput>
  }

  export type userUpsertWithoutUser_configInput = {
    update: XOR<userUpdateWithoutUser_configInput, userUncheckedUpdateWithoutUser_configInput>
    create: XOR<userCreateWithoutUser_configInput, userUncheckedCreateWithoutUser_configInput>
    where?: userWhereInput
  }

  export type userUpdateToOneWithWhereWithoutUser_configInput = {
    where?: userWhereInput
    data: XOR<userUpdateWithoutUser_configInput, userUncheckedUpdateWithoutUser_configInput>
  }

  export type userUpdateWithoutUser_configInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userAccount?: StringFieldUpdateOperationsInput | string
    userPassword?: StringFieldUpdateOperationsInput | string
    unionId?: NullableStringFieldUpdateOperationsInput | string | null
    mpOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    userName?: NullableStringFieldUpdateOperationsInput | string | null
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    userProfile?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    updateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    isDelete?: IntFieldUpdateOperationsInput | number
    audio_file?: audio_fileUpdateManyWithoutUserNestedInput
  }

  export type userUncheckedUpdateWithoutUser_configInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    userAccount?: StringFieldUpdateOperationsInput | string
    userPassword?: StringFieldUpdateOperationsInput | string
    unionId?: NullableStringFieldUpdateOperationsInput | string | null
    mpOpenId?: NullableStringFieldUpdateOperationsInput | string | null
    userName?: NullableStringFieldUpdateOperationsInput | string | null
    userAvatar?: NullableStringFieldUpdateOperationsInput | string | null
    userProfile?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: StringFieldUpdateOperationsInput | string
    createTime?: DateTimeFieldUpdateOperationsInput | Date | string
    updateTime?: DateTimeFieldUpdateOperationsInput | Date | string
    isDelete?: IntFieldUpdateOperationsInput | number
    audio_file?: audio_fileUncheckedUpdateManyWithoutUserNestedInput
  }

  export type dictionary_wordCreateManyEnglish_dictionaryInput = {
    word_id: bigint | number
    created_at?: Date | string | null
    id?: bigint | number | null
  }

  export type dictionary_wordUpdateWithoutEnglish_dictionaryInput = {
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    english_word?: english_wordUpdateOneRequiredWithoutDictionary_wordNestedInput
  }

  export type dictionary_wordUncheckedUpdateWithoutEnglish_dictionaryInput = {
    word_id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type dictionary_wordUncheckedUpdateManyWithoutEnglish_dictionaryInput = {
    word_id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type dictionary_wordCreateManyEnglish_wordInput = {
    dictionary_id: bigint | number
    created_at?: Date | string | null
    id?: bigint | number | null
  }

  export type english_word_change_logCreateManyEnglish_wordInput = {
    id: bigint | number
    field_name: string
    old_value?: string | null
    new_value?: string | null
    change_time?: Date | string
    changed_by?: bigint | number | null
  }

  export type media_creatorCreateManyEnglish_wordInput = {
    id?: bigint | number
    media_type: string
    media_url?: string | null
    creator_id?: bigint | number | null
    info?: string | null
    created_at?: Date | string | null
  }

  export type dictionary_wordUpdateWithoutEnglish_wordInput = {
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    english_dictionary?: english_dictionaryUpdateOneRequiredWithoutDictionary_wordNestedInput
  }

  export type dictionary_wordUncheckedUpdateWithoutEnglish_wordInput = {
    dictionary_id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type dictionary_wordUncheckedUpdateManyWithoutEnglish_wordInput = {
    dictionary_id?: BigIntFieldUpdateOperationsInput | bigint | number
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type english_word_change_logUpdateWithoutEnglish_wordInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    field_name?: StringFieldUpdateOperationsInput | string
    old_value?: NullableStringFieldUpdateOperationsInput | string | null
    new_value?: NullableStringFieldUpdateOperationsInput | string | null
    change_time?: DateTimeFieldUpdateOperationsInput | Date | string
    changed_by?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type english_word_change_logUncheckedUpdateWithoutEnglish_wordInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    field_name?: StringFieldUpdateOperationsInput | string
    old_value?: NullableStringFieldUpdateOperationsInput | string | null
    new_value?: NullableStringFieldUpdateOperationsInput | string | null
    change_time?: DateTimeFieldUpdateOperationsInput | Date | string
    changed_by?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type english_word_change_logUncheckedUpdateManyWithoutEnglish_wordInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    field_name?: StringFieldUpdateOperationsInput | string
    old_value?: NullableStringFieldUpdateOperationsInput | string | null
    new_value?: NullableStringFieldUpdateOperationsInput | string | null
    change_time?: DateTimeFieldUpdateOperationsInput | Date | string
    changed_by?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type media_creatorUpdateWithoutEnglish_wordInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    media_type?: StringFieldUpdateOperationsInput | string
    media_url?: NullableStringFieldUpdateOperationsInput | string | null
    creator_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    info?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type media_creatorUncheckedUpdateWithoutEnglish_wordInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    media_type?: StringFieldUpdateOperationsInput | string
    media_url?: NullableStringFieldUpdateOperationsInput | string | null
    creator_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    info?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type media_creatorUncheckedUpdateManyWithoutEnglish_wordInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    media_type?: StringFieldUpdateOperationsInput | string
    media_url?: NullableStringFieldUpdateOperationsInput | string | null
    creator_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    info?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type audio_fileCreateManyUserInput = {
    id?: bigint | number
    path?: string | null
    content?: string | null
    create_time?: Date | string | null
    update_time?: Date | string | null
    is_delete?: number | null
    status?: string
    name?: string
  }

  export type audio_fileUpdateWithoutUserInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    path?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type audio_fileUncheckedUpdateWithoutUserInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    path?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type audio_fileUncheckedUpdateManyWithoutUserInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    path?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    create_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    update_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_delete?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}