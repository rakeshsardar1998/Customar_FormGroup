import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'commaSeperator'})
export class CommaSeperatorPipe implements PipeTransform {
  transform(value: number): string {
	value	= Math.round( value );
    return Number(value).toLocaleString('en-IN');
  }
}