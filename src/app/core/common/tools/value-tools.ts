import { FormGroup } from "@angular/forms";
import * as _moment from 'moment';
import * as _ from 'lodash';

export class ValueTools {

  static removeIndex(arr: any[], inx: number) {
    return arr.splice(inx, 1);
  }

  static reduceObjectValues(obj: any, cache = {}) {
    const objectValues = Object.keys(obj).reduce((acc, cur) => {
      if (!Array.isArray(obj[cur]) && typeof obj[cur] === 'object') {
        return this.reduceObjectValues({ ...acc, ...obj[cur] }, cache);
      }
      acc[cur] = obj[cur];

      return acc;
    }, {});

    return {
      ...objectValues,
      ...cache
    };
  }

  static cloneObject(source: any) {
    return JSON.parse(JSON.stringify(source));
  }

  static markAsTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        ValueTools.markAsTouched(control);
      }
    });
  }


  static isValidValue(value: any) {
    return value !== undefined && value !== null;
  }

  static isMeaningValue(value: any) {
    return value !== undefined && value !== null && value !== '';
  }

  static formart(pattern: string, values: string[]): string {
    return pattern.replace(/{(\d+)}/g, function (match, number) {
      return typeof values[number] != 'undefined'
        ? values[number]
        : match
        ;
    });
  }

  static isMatchCondition(condition: any, scopeData: any, pageData: any = null) {
    if (condition.type) {
      const { listCond } = condition;
      if (condition.type === 'and') {
        let check = true;
        listCond.forEach(con => {
          check = check && this.isMatchCondition(con, scopeData, pageData);
        });
        return check;
      }
      return false;
    }
    let sourceMap = condition.source;
    let sourceScope = scopeData;
    if (!sourceMap) {
      sourceMap = condition.$source;
    }
    if (!sourceMap) {
      sourceMap = condition.g$source;
      sourceScope = pageData;
    }
    if (!sourceMap) {
      const lsMap = this.getLocalStorageMap(condition.ls$source);
      const lsId = lsMap.lsId;
      sourceMap = lsMap.map;
      sourceScope = JSON.parse(localStorage.getItem(lsId));
    }
    const sourceValue = this.getDynamicValue(sourceScope, sourceMap);
    if (condition.operator === '==') {
      return sourceValue === condition.value;
    }
    if (condition.operator === '===') {
      return sourceValue === condition.value;
    }
    if (condition.operator === '!==') {
      return sourceValue !== condition.value;
    }
    if (condition.operator === '>') {
      return sourceValue > condition.value;
    }
    if (condition.operator === '>=') {
      return sourceValue >= condition.value;
    }
    if (condition.operator === '<') {
      return sourceValue < condition.value;
    }
    if (condition.operator === '<=') {
      return sourceValue <= condition.value;
    }
    if (condition.operator === 'in') {
      return condition.value.indexOf(sourceValue) >= 0;
    }
    if (condition.operator === '!in') {
      return condition.value.indexOf(sourceValue) < 0;
    }
    if (condition.operator === 'exist' || condition.operator === 'valid') {
      return sourceValue !== undefined && sourceValue !== null;
    }
    if (condition.operator === 'meaning') {
      return sourceValue !== undefined && sourceValue !== null && sourceValue !== '';
    }
    if (condition.operator === '!meaning') {
      return sourceValue === undefined || sourceValue === null || sourceValue === '';
    }
    if (condition.operator === 'boolean' || condition.operator === '!boolean') {
      let check = true;
      if (Array.isArray(sourceValue)) {
        for (let item of sourceValue) {
          check = check && new Boolean(item).valueOf();
        }
      } else {
        check = new Boolean(sourceValue).valueOf();
      }
      return condition.operator === 'boolean' ? check : !check;
    }
    return false;
  }

  static getSourceValue(data: any, key: string, selector: any,) {
    if (key.startsWith('$')) {
      return {
        key: key.substring(1),
        value: this.getDynamicValue(data, selector)
      };
    } else {
      return {
        key,
        value: selector
      };
    }
  }

  static isDynamicValue(key: string) {
    return key.startsWith('$');
  }

  static getDynamicValue(data: any, selector: any) {
    return this.loopDynamicValue(data, 0, selector.split('.'));
  }

  static loopDynamicValue(data: any, fieldIndex: number, selector: any[]) {
    if (!data) {
      return null;
    }
    if (fieldIndex >= selector.length) {
      return data;
    }
    let fieldName = selector[fieldIndex];
    let selectedIndex = -1;
    if (fieldName.endsWith(']')) {
      const openIndex = fieldName.lastIndexOf('[');
      selectedIndex = Number(fieldName.substring(openIndex + 1, fieldName.length - 1));
      fieldName = fieldName.substring(0, openIndex);
    }
    if (Array.isArray(data)) {
      const output = [];
      for (let item of data) {
        if (typeof (item) === 'object') {
          let children = null;
          if (Array.isArray(item[fieldName]) && selectedIndex >= 0) {
            children = this.loopDynamicValue(item[fieldName][selectedIndex], fieldIndex + 1, selector);
          } else {
            children = this.loopDynamicValue(item[fieldName], fieldIndex + 1, selector);
          }
          if (Array.isArray(children)) {
            output.push(...children);
          } else {
            output.push(children);
          }
        } else {
          output.push(item);
        }
      }
      return output;
    } else {
      if (data && typeof (data) === 'object') {
        if (Array.isArray(data[fieldName]) && selectedIndex >= 0) {
          return this.loopDynamicValue(data[fieldName][selectedIndex], fieldIndex + 1, selector);
        } else {
          return this.loopDynamicValue(data[fieldName], fieldIndex + 1, selector);
        }
      } else {
        return data;
      }
    }
  }

  static doDeepMap(map: any, scopeData: any, pageData: any = {}) {
    if (typeof (map) === 'string') {
      return ValueTools.getDynamicValue(scopeData, map);
    }
    if (map === null) {
      return null;
    }

    if (typeof (map) === 'object') {
      let output = {};
      for (let fieldName in map) {
        if (!map[fieldName]) {
          output[fieldName] = map[fieldName];
          continue;
        }
        if (fieldName.startsWith('$')) {
          output[fieldName.substring(1)] = ValueTools.getDynamicValue(scopeData, map[fieldName]);
        } else if (fieldName.startsWith('g$')) {
          output[fieldName.substring(2)] = ValueTools.getDynamicValue(pageData, map[fieldName]);
        } else if (fieldName.startsWith('c$')) {
          output[fieldName.substring(2)] = new Function('scopeData', 'pageData', map[fieldName]).call(this, scopeData, pageData);
        } else if (fieldName.startsWith('ls$')) {
          const lsMap = this.getLocalStorageMap(map[fieldName]);
          const lsId = lsMap.lsId;
          const newMap = lsMap.map;
          output[fieldName.substring(3)] = ValueTools.getDynamicValue(
            JSON.parse(localStorage.getItem(lsId)),
            newMap
          );
        } else if (fieldName.startsWith('[]')) {
          const sourceArray = ValueTools.getDynamicValue(scopeData, map[fieldName].source);
          const actualFieldName = fieldName.substring(2);
          if (sourceArray) {
            output[actualFieldName] = [];
            for (let item of sourceArray) {
              output[actualFieldName].push(
                this.doDeepMap(map[fieldName].item, item, pageData)
              );
            }
          } else {
            output[actualFieldName] = null;
          }
        } else {
          if (Array.isArray(map[fieldName])) {
            output[fieldName] = [];
            for (let item of map[fieldName]) {
              if (item) {
                if (typeof item === 'string') {
                  if (item.startsWith('$')) {
                    output[fieldName].push(ValueTools.getDynamicValue(scopeData, item.substring(1)));
                  } else {
                    output[fieldName].push(item);
                  }
                } else if (item.if$) {
                  if (ValueTools.isMatchCondition(item.if$, scopeData, pageData)) {
                    output[fieldName].push(this.doDeepMap(item.source, scopeData, pageData));
                  }
                } else if (ValueTools.isValidValue(item.addArray$)) {
                  if (item.addArray$) {
                    const sourceArray = ValueTools.getDynamicValue(scopeData, item.source);
                    if (sourceArray) {
                      for (let itemSourceArray of sourceArray) {
                        output[fieldName].push(
                          this.doDeepMap(item.item, itemSourceArray, pageData)
                        );
                      }
                    }
                  }
                } else {
                  output[fieldName].push(this.doDeepMap(item, scopeData, pageData));
                }
              } else {
                output[fieldName].push(item);
              }
            }
          } else if (typeof (map[fieldName]) === 'object') {
            if (map[fieldName].if$) {
              if (ValueTools.isMatchCondition(map[fieldName].if$, scopeData, pageData)) {
                output[fieldName] = this.doDeepMap(map[fieldName].source, scopeData, pageData);
              }
            } else {
              output[fieldName] = this.doDeepMap(map[fieldName], scopeData, pageData);
            }
          } else {
            output[fieldName] = map[fieldName];
          }
        }
      }
      return output;
    }
    return null;
  }

  static doMap(map: any, scopeData: any, pagedata: any = {}) {
    if (typeof (map) === 'string') {
      return ValueTools.getDynamicValue(scopeData, map);
    }
    if (map === null) {
      return null;
    }
    const output = {};
    for (let i in map) {
      if (i.startsWith('$')) {
        output[i.substring(1)] = ValueTools.getDynamicValue(scopeData, map[i]);
      } else if (i.startsWith('g$')) {
        output[i.substring(2)] = ValueTools.getDynamicValue(pagedata, map[i]);
      } else if (i.startsWith('ls$')) {
        const lsMap = this.getLocalStorageMap(map[i]);
        const lsId = lsMap.lsId;
        const newMap = lsMap.map;
        output[i.substring(3)] = ValueTools.getDynamicValue(
          JSON.parse(localStorage.getItem(lsId)),
          newMap
        );
      } else if (i.startsWith('cd$')) {
        let valueResul: any;

        valueResul = ValueTools.getCurrentday();
        output[i.substring(3)] = valueResul;
      } else {
        output[i] = map[i];
      }
    }
    return output;
  }

  // static doPostProcessApiData(apiConfig: any, data: any, scopeData: any, pageData: any = null, page: NgxDynamicComponent = null) {
  //   let sourceData = null;
  //   if (apiConfig.mapOutputData) {
  //     sourceData = ValueTools.doMap(apiConfig.mapOutputData, data);
  //   } else {
  //     sourceData = ValueTools.cloneObject(data);
  //   }
  //   if (apiConfig.mapOutputItemData && Array.isArray(sourceData)) {
  //     for (let i in sourceData) {
  //       sourceData[i] = ValueTools.doMap(apiConfig.mapOutputItemData, sourceData[i], scopeData);
  //     }
  //   }
  //   if (page) {
  //     if (apiConfig.outputId) {
  //       page.valueChange({
  //         id: apiConfig.outputId,
  //         value: data
  //       });
  //     }
  //   }
  //   return sourceData;
  // }

  static hardIndexInArray(array: any, index: any) {
    return array[index];
  }

  static hardIndex(index: any) {
    return index;
  }

  static getLocalStorageMap(map: string) {
    const split = map.split('.');
    const lsId = split.shift();
    const newMap = split.join('.');
    return {
      lsId: lsId, // decodeToekn
      map: newMap // user_name
    };
  }

  static getFistDayOfMonth() {
    let today = new Date();
    let dd: any = '01';
    let mm: any = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    return mm + '/' + dd + '/' + yyyy;
  }

  static getCurrentday() {
    const today = new Date();
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1;
    const yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    return mm + '/' + dd + '/' + yyyy;
  }

  static dateISOParser(value: string): string {
    try {
      let date: Date = new Date(value);
      date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
      return date.toISOString();
    } catch (e) {
      console.error('DateISOParser: Can\'t not parser', value);
      return value;
    }
  }

  static dateISOParser2(value: string): string {
    try {
      const date: Date = new Date(value);
      return date.toISOString();
    } catch (e) {
      console.error('DateISOParser: Can\'t not parser', value);
      return value;
    }
  }

  static startOfDay(value: string): string {
    try {
      const date = _moment(value);
      return date.startOf('day').toISOString();
    } catch (e) {
      console.error('startOfDay: Can\'t not parser', value);
      return value;
    }
  }


  static endtOfDay(value: string): string {
    try {
      const date = _moment(value);
      return date.endOf('day').toISOString();
    } catch (e) {
      console.error('DateISOParser: Can\'t not parser', value);
      return value;
    }
  }

  static convertDateToCallApi(data: any) {
    let dd: any = data.getDate();
    let mm: any = data.getMonth() + 1;
    const yyyy: any = data.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    // dataResult = dd + '/' + mm + '/' + yyyy;
    const dataResult = yyyy + '-' + mm + '-' + dd;

    return dataResult;
  }

  static convertDateToCallApi2(data: any, isStart: boolean) {
    let dd: any = data.getDate();
    let mm: any = data.getMonth() + 1;
    const yyyy: any = data.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
    return `${ dd }/${ mm }/${ yyyy } ${ isStart ? '00:00:00' : '23:59:59' }`;
  }

  static joiningWithUnit(separator: string, unit: string, ...arg) {
    let result = this.joiningStr(separator, arg);

    if (unit) {
      result = result + unit;
    }

    return result;
  }


  static joiningStr(separator: string, ...arg) {
    return arg.map(item => {
      if (typeof item === 'number' && item == null) {
        item = 0;
      }
      return item;
    }).filter(item => item !== null)
    .join(separator).trim();
  }

  static convertValueToNumber(value: any) {
    if (!value) {
      return 0;
    }

    return value;
  }


}
