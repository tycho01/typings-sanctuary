import SanctuaryMod = require('./sanctuary/index');
import {
  Maybe, Semigroup, MaybeSemigroup, SanctuaryModule, Either, EitherFunc,
  EitherSemigroup
} from './sanctuary/sanctuary-types';

// Cast is not required, you can use commented out version. Cast is here only to help IDE (IDEA) with type inferring.
// const S = SanctuaryMod.create({checkTypes: false, env: SanctuaryMod.env});
const S = (<SanctuaryModule>SanctuaryMod).create({checkTypes: false, env: SanctuaryMod.env});

// Note: One cannot use statement like `const Maybe = S.Maybe` because then TS compiler would emmit a require call
// for sanctuary-types module which would fail at runtime.

const fnInc = (x: number): number => x + 1;
const fnAdd = (x: number) => (y: number): number => x + y;
const fnStrLen = (x: string): number => x.length;
const fnThreeOp = (x: string) => (y: boolean): number => -1;

// Semigroup
(() => {
  const a: Semigroup<string> = '';
  const b: Semigroup<number[]> = [1];
})();

// Classify
(() => {
  const a: string = S.type('');
  const b: boolean = S.is(Number, 4);
})();

// Combinator
(() => {
  type n = number;
  const a: n = S.I(1);
  const b: n = S.K(2);
  const c: n = S.K(3, '');
  const d: n = S.A(fnInc, 0);
  const e: n = S.T(0, fnInc);
  const f: n = S.C(fnThreeOp, true, '');
  const g: n = S.B(Math.sqrt, fnInc, 99);
  const h: n = S.S(fnAdd, Math.sqrt, 100);
})();

// Function
(() => {
  const a: (a: string, b: number) => boolean = S.flip((b: number, a: string) => false);
  const b: Maybe<number> = S.lift(fnInc, S.Maybe.of(1));
  const add = (a: number) => (b: number): number => a + b;
  const c: Maybe<number> = S.lift2(add, S.Just(1), S.Maybe.of(2));
  const d = <Acc,Item>(op: (acc: Acc, item: Item) => Acc) => <Acc>(zero: Acc) => <Item>(input: Item[]): Acc => zero;
  const e: Maybe<number> = S.lift3(d, S.Just(add), S.Just(0), S.Maybe.of([1, 2, 3]));
})();

// Composition
(() => {
  const a: number = S.compose(fnInc, fnStrLen)('');
  const b: number = S.pipe([fnStrLen, fnInc])('');
  const c: number = S.pipe([fnStrLen, fnStrLen])('');
  const fa = (s: string): number => s.length;
  const fb = (s: number): string => s.toString();
  const d: string = S.pipe([fa, fb, fa, fb, fa, fb, fa, fb, fa, fb])('');
  const e: string = S.meld([fa, fb])('');
  const fc = (n: number, s: string): string => n + s;
  const fd = (x: number, y: number): number => x + y;
  const f: string = S.meld([fd, fc])(1, 2, 'x');
})();

// Maybe
(() => {
  const a: Maybe<any> = S.Maybe.empty();
  const b: Maybe<number> = S.Maybe.of(1);
  const c: Maybe<number> = S.Maybe.of(fnInc).ap(S.Maybe.of(4));
  const d: boolean = S.Maybe.of(fnInc).isJust;
  const maybeNumber = (s: string): Maybe<number> => S.Maybe.of(s.length);
  const e: Maybe<number> = S.Maybe.of('').chain(maybeNumber); // flatMap
  const f: Semigroup<any[]> = [];
  const g: MaybeSemigroup<number[]> = S.Maybe.of([1]);
  const h: Maybe<number> = S.Just(0);
  const ch: Maybe<number> = S.Nothing<number>(); // meh, ugly. but without type variable it's not working
  const i: MaybeSemigroup<number[]> = S.Maybe.of([1]).concat(S.Just([2]));
  const j: MaybeSemigroup<number[]> = S.Maybe.of([1]).concat(S.Nothing<number[]>()); // a bit ugly
  const k: Maybe<any> = S.Nothing();
  const l: Maybe<number> = S.Maybe.of(1).empty();
  const m: boolean = S.Maybe.of(1).equals(2);
  //const n: Maybe<number> = S.Maybe.of(1).extend((a) => a.value);
  const o: Maybe<number> = S.Maybe.of(1).filter(x=>x > 1);
  const t: Maybe<number> = S.Maybe.of('').map(fnStrLen);
  const u: Maybe<number> = S.Maybe.of('').of(0);
  const v: string = S.Maybe.of(4).reduce((acc, item) => acc + item, '');
  const w: boolean = S.isNothing(S.Maybe.of(1));
  const x: boolean = S.isJust(S.Maybe.of(1));
  const y: number = S.fromMaybe(0, S.Just(42));
  const z: number|null = S.maybeToNullable(S.Just(42));
  const aa: Maybe<number> = S.toMaybe<number>(null);
  const ab: Maybe<number> = S.toMaybe(42);
  const ac: number = S.maybe(0, fnStrLen, S.Just(''));
  const ad: number[] = S.justs([S.Just(1), S.Nothing<number>()]);
  const ae = (x: number[]): Maybe<number> => S.Nothing<number>(); // generic variant isn't working even though I think it should
  const af: number[] = S.mapMaybe(ae, [[1]]);
  const ag = (s: string): number => 0;
  const ah = (s: string, t: string): number => 0;
  const ahC = (s: string) => (t: string): number => 0;
  const ach = (s: string, t: string, u: string): number => 0;
  const achC = (s: string) => (t: string) => (u: string): number => 0;
  const aj: Maybe<number> = S.encase(ag, '');
  const ak: Maybe<number> = S.encase2(ahC, '', '');
  const al: Maybe<number> = S.encase2_(ah, '', '');
  const am: Maybe<number> = S.encase3(achC, '', '', '');
  const an: Maybe<number> = S.encase3_(ach, '', '', '');
  const ao: boolean = b.toBoolean();
  const ap: string = b.toString();
  const aq: string = b.inspect();
  //const ar: Either<string, Maybe<number>> = S.Nothing<number>().sequence(S.Either.of);
  // TODO: sequence
})();

// Either
(() => {
  type ENS = Either<number, string>;
  type ENB = Either<number, boolean>;
  type ESN = Either<string, number>;
  type E_SGS_SGNA = EitherSemigroup<string, number[]>;
  const eNS: ENS = S.Either.of('');
  const a: ENS = S.Either.of('');
  const b: boolean = eNS.isLeft;
  const c: boolean = eNS.isRight;
  const d: EitherFunc<number, (a: string)=>number, string, number> = S.Either.of((x: string)=>x.length);
  const e: ENS = S.Either.of(' ');
  const f: Either<number, number> = d.ap(e);
  const sqrt: (a: number) => ESN = n => n < 0 ?
    S.Left<string, number>('Cannot represent square root of negative number') :
    S.Right<string, number>(Math.sqrt(n));
  const g: ESN = S.Left<string, number>('err').chain(sqrt);
  const h: ESN = S.Right(4).chain(sqrt);
  const ch: E_SGS_SGNA = S.Left<string, number[], string, number[]>('abc');
  const i: E_SGS_SGNA = ch.concat(S.Left<string, number[], string, number[]>('def'));
  const j: E_SGS_SGNA = ch.concat(S.Right<string, number[], string, number[]>([4]));
  const k: boolean = a.equals(4);
  const l = (x: ENS): string => '';
  const m: ENS = a.extend(l);
  const n = (x: string): boolean => Boolean(x);
  // a is ENS
  const o: ENB = a.map(n);
  const p: ENB = a.of(true);
  const q: boolean = a.toBoolean();
  const r: string = a.toString();
  const s: string = a.inspect();
  const t: boolean = S.isLeft(a);
  const u: boolean = S.isRight(a);
  const v: boolean = S.either((x: number) => true, (x: string) => false, a);
  const w: number[] = S.lefts([a, a]);
  const x: string[] = S.rights([a, a]);
  type EEO = Either<Error, any>;
  const y: EEO = S.encaseEither(S.I, JSON.parse, 'true');
  const z: EEO = S.encaseEither(S.I, JSON.parse, '[');
  type EE_BA = Either<Error, boolean[]>;
  const aa: EE_BA = S.encaseEither2(S.I, (a: string) => (b: number) => [true], '', 1);
  const ab: EE_BA = S.encaseEither2_(S.I, (a: string, b: number) => [true], '', 1);
  const ac: EE_BA = S.encaseEither3(S.I, (a: string) => (b: number) => (c: boolean) => [true], '', 1, false);
  const ad: EE_BA = S.encaseEither3_(S.I, (a: string, b: number, c: boolean) => [true], '', 1, false);
  const ae: Maybe<string> = S.eitherToMaybe(a);
  const af: number[] = S.Right(5).reduce((xs, x) => xs.concat([x]), [42]);
  // TODO: sequence
})();

// Alternative
(() => {
  const a: number[] = S.and([], [1]);
  const b: Maybe<number> = S.or(S.Just(0), S.Nothing<number>());
  const c: boolean = S.xor(false, true);
})();

// Logic
(() => {
  const a: boolean = S.not(true);
  const b: string = S.ifElse(a=>a > 0, x=>'+' + x, x=>x.toString(), 4);
  const c: boolean = S.allPass([x=>x > 1, x=>x % 2 == 0], 4);
  const d: boolean = S.anyPass([x=>x > 1, x=>x % 2 == 0], 4);
})();

// List
(() => {
  type na = number[];
  type n = number;
  const a: na = S.concat([1], [2]);
  const b: Maybe<na> = S.slice(0, 1, [1]);
  const c: Maybe<n> = S.at(1, [1, 2]);
  const d: Maybe<n> = S.head([1]);
  const e: Maybe<n> = S.last([1]);
  const f: Maybe<na> = S.tail([1]);
  const g: Maybe<na> = S.init([1]);
  const h: Maybe<na> = S.take(2, [1]);
  const ch: Maybe<na> = S.takeLast(2, [1]);
  const i: Maybe<na> = S.drop(2, [1]);
  const j: Maybe<na> = S.dropLast(2, [1]);
  const k: na = S.reverse([1]);
  const l: Maybe<n> = S.indexOf('a', ['']);
  const m: Maybe<n> = S.lastIndexOf('a', ['']);
})();

// Array
(() => {
  const a: number[] = S.append(2, [1]);
  const b: number[] = S.prepend(1, [2]);
  const c: Maybe<number> = S.find(x => x > 0, [1]);
  const d: Maybe<number>[] = S.pluck(Number, 'x', [{x: 1}, {x: 2}]);
  const e: number = S.reduce(acc => item => acc + item, 0, [1]);
  const f: number = S.reduce_((acc, item) => acc + item, 0, [1]);
  const g: number[] = S.unfoldr<number, number>(n => n < 5 ? S.Just([n, n + 1]) : S.Nothing(), 1);
  const h: number[] = S.range(0, 10);
})();

// Object
(() => {
  const a: number = S.prop('a', {a: 1});
  // const b: Maybe<number> = S.get<number>(<any>Number, 'a', {});
  const b: Maybe<number> = S.get(Number, 'a', {});
  const c: Maybe<number> = S.gets(Number, ['b'], {});
  const d: string[] = S.keys({});
  const e: any[] = S.values({});
  const f: Array<[string,any]> = S.pairs({});
})();

// Number
(() => {
  type n = number;
  const a: n = S.negate(1);
  const b: n = S.add(1, 2);
  const c: n = S.sum([1, 2]);
  const d: n = S.sum(S.Just(42));
  const e: n = S.sub(1, 2);
  const f: n = S.inc(1);
  const g: n = S.dec(1);
  const h: n = S.mult(1, 2);
  const ch: n = S.product([1, 2]);
  const i: n = S.div(1, 2);
  const j: n = S.min(1, 2);
  const k: n = S.max(1, 2);
})();

// Integer
(() => {
  const a: boolean = S.even(1);
  const b: boolean = S.odd(1);
})();

// Parse
(() => {
  const a: Maybe<Date> = S.parseDate('');
  const b: Maybe<number> = S.parseFloat('');
  const c: Maybe<number> = S.parseInt(10, '');
  const d: Maybe<number> = S.parseJson(Number, ''); // not great, without a hint it's inferred as Maybe<any>
})();

// RegExp
(() => {
  const a: RegExp = S.regex('', '');
  const b: string = S.regexEscape('');
  const c: boolean = S.test(new RegExp(''), '');
  const d: Maybe<Array<Maybe<string>>> = S.match(new RegExp(''), '');
})();

// String
(() => {
  const a: string = S.toUpper('a');
  const b: string = S.toLower('a');
  const c: string = S.trim('a');
  const d: string[] = S.words('a');
  const e: string = S.unwords(['a']);
  const f: string[] = S.lines('a');
  const g: string = S.unlines(['a']);
})();
