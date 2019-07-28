import * as React from "react";
interface ReorderProps {
    itemKey: string;
    lock: 'horizontal' | 'vertical';
    holdTime: number;
    list: Array<object>;
    template: React.Component;
    callback: (event: any, item: object, prevIndex: number, newIndex: number, arr: Array<object>) => any;
    listClass: string;
    itemClass: string;
    itemClicked: (event: any, item: object, index: number) => any;
    selected: any;
    selectedKey: string;
    disabledReorder: boolean;
}
declare class Reorder extends React.Component<ReorderProps, {}> {}
declare namespace Reorder {
    export function reorder<T extends any[]>(list: T, previousIndex: number, nextIndex: number);
}
export = Reorder;