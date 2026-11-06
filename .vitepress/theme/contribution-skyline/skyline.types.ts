export type SkylineKind = 'pad' | 'unknown' | 'zero' | 'positive'
export type Pt = [number, number]
export interface SkylineCellInput {col:number;row:number;date:string|null;count:number|null;level:number|null}
export interface SkylineOptions {gap?:number;hMaxFactor?:number;hMinFactor?:number;hMinPx?:number;padFactor?:number;labelLeftFactor?:number;labelBottomFactor?:number}
export interface SkylineFrame {ox:number;oy:number;width:number;height:number;hMax:number}
export interface SkylineFaces {top:Pt[];left:Pt[]|null;front:Pt[]|null}
export interface SkylinePrism extends SkylineFaces {col:number;row:number;date:string;count:number|null;level:number|null;kind:SkylineKind;h:number|null;key:number;order:number}
export interface SkylineLayout extends SkylineFrame {pitch:number;weeksCount:number;max:number;prisms:SkylinePrism[]}
