export class DoubleLinkedList<ItemT> {
  /** This is set to `undefined` on any list mutations and rebuilt when `toArray` is called if needed */
  private allValues: Readonly<ItemT[]> | undefined;

  private firstNode: DoubleLinkedListNode<ItemT> | undefined;
  private lastNode: DoubleLinkedListNode<ItemT> | undefined;
  private length = 0;

  public constructor(...items: ItemT[]) {
    for (const item of items) {
      this.append(item);
    }
  }

  public readonly getLength = () => this.length;
  public readonly isEmpty = () => this.firstNode === undefined;

  public readonly append = (item: ItemT): Readonly<DoubleLinkedListNode<ItemT>> => {
    const newNode = new DoubleLinkedListNode<ItemT>(this, item);

    if (this.firstNode === undefined) {
      this.firstNode = newNode;
      this.lastNode = newNode;
    } else {
      newNode.previousNode = this.lastNode;
      this.lastNode!.nextNode = newNode;
      this.lastNode = newNode;
    }

    this.allValues = undefined;
    this.length += 1;

    return newNode;
  };

  public readonly prepend = (item: ItemT): Readonly<DoubleLinkedListNode<ItemT>> => {
    const newNode = new DoubleLinkedListNode<ItemT>(this, item);

    if (this.firstNode === undefined) {
      this.firstNode = newNode;
      this.lastNode = newNode;
    } else {
      newNode.nextNode = this.firstNode;
      this.firstNode!.previousNode = newNode;
      this.firstNode = newNode;
    }

    this.allValues = undefined;
    this.length += 1;

    return newNode;
  };

  public readonly clear = () => {
    while (this.firstNode !== undefined) {
      this.remove(this.firstNode);
    }
  };

  public readonly getHead = (): Readonly<DoubleLinkedListNode<ItemT>> | undefined => this.firstNode;
  public readonly getTail = (): Readonly<DoubleLinkedListNode<ItemT>> | undefined => this.lastNode;

  public readonly toArray = (): Readonly<ItemT[]> => {
    if (this.allValues !== undefined) {
      return this.allValues;
    }

    const output: ItemT[] = [];
    let cursor = this.firstNode;
    while (cursor !== undefined) {
      output.push(cursor.value);
      cursor = cursor.nextNode;
    }

    this.allValues = Object.freeze(output);

    return output;
  };

  public readonly remove = (node: DoubleLinkedListNode<ItemT>) => {
    if (node.list !== this) {
      return false; // Nothing to do -- wrong list
    }

    if (node === this.firstNode) {
      // Removing head

      this.firstNode = node.nextNode;
      if (this.firstNode !== undefined) {
        this.firstNode.previousNode = undefined;
      } else {
        this.lastNode = undefined;
      }
    } else if (node === this.lastNode) {
      // Removing tail

      this.lastNode = node.previousNode;
      if (this.lastNode !== undefined) {
        this.lastNode.nextNode = undefined;
      } else {
        this.firstNode = undefined;
      }
    } else {
      // Removing middle

      node.previousNode!.nextNode = node.nextNode;
      node.nextNode!.previousNode = node.previousNode;
    }

    node.previousNode = undefined;
    node.nextNode = undefined;
    node.list = undefined;

    this.allValues = undefined;
    this.length -= 1;

    return true;
  };
}

export class DoubleLinkedListNode<ItemT> {
  constructor(
    public list: DoubleLinkedList<ItemT> | undefined,
    public readonly value: ItemT,
    public previousNode?: DoubleLinkedListNode<ItemT>,
    public nextNode?: DoubleLinkedListNode<ItemT>
  ) {}
}
