import {test} from 'node:test';
import assert from 'node:assert/strict';
import {scheduleGain,NORMAL_VOLUME,LETTER_VOLUME} from './audio-fade.ts';
test('cinematic audio holds current automation and ramps smoothly to normal and letter levels',()=>{
const calls=[];
const param={value:0,cancelAndHoldAtTime:t=>calls.push(['hold',t]),linearRampToValueAtTime:(v,t)=>calls.push(['ramp',v,t])};
scheduleGain(param,10,NORMAL_VOLUME,2.5);
scheduleGain(param,11,LETTER_VOLUME,1.8);
assert.deepEqual(calls,[['hold',10],['ramp',.38,12.5],['hold',11],['ramp',.18,12.8]]);
});
test('older engines preserve current gain and clamp levels',()=>{
const calls=[];const param={value:.22,cancelScheduledValues:t=>calls.push(['cancel',t]),setValueAtTime:(v,t)=>calls.push(['set',v,t]),linearRampToValueAtTime:(v,t)=>calls.push(['ramp',v,t])};
scheduleGain(param,1,2,1.8);
assert.deepEqual(calls,[['cancel',1],['set',.22,1],['ramp',1,2.8]]);
});
