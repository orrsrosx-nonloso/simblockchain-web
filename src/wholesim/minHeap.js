export class MinHeap {
    constructor() {
        this.heap = []
    }
    /**
     * 获取当前元素的父元素的index
     */
    getParentIndex(index) {
        return (index - 1) >> 1
    }
    /**
     *  获取当前元素的左子元素的index
     */
    getLeftIndex(index) {
        return index * 2 + 1
    }
    /**
     *  获取当前元素的右子元素的index
     */
    getRightIndex(index) {
        return index * 2 + 2
    }
    // 交换两个元素的封装方法
    swap(index1, index2) {
        const tmp = this.heap[index1]
        this.heap[index1] = this.heap[index2]
        this.heap[index2] = tmp
    }
    /**
    * 将当前元素与他的父元素的大小进行比较，当父元素值大于子元素时，交换两个元素，
    * 递归操作 比较对象改为timestamp
    */
    shiftUp(index) {
        if (index === 0) return
        const parentIndex = this.getParentIndex(index)
        if (this.heap[index].timestamp < this.heap[parentIndex].timestamp) {
            this.swap(index, parentIndex)
            this.shiftUp(parentIndex)
        }
    }
    /**
     *  将当前元素与他的左右子元素的大小进行比较，当父元素值大于左子元素时，交换两个元素，
     *               递归操作；右子元素操作相同 比较对象改为timestamp
     */
    shiftDown(index) {
        const leftIndex = this.getLeftIndex(index)
        const rightIndex = this.getRightIndex(index)
        let minIndex
        if (this.heap[leftIndex]) minIndex = this.heap[index].timestamp > this.heap[leftIndex].timestamp ? leftIndex : index
        if (this.heap[rightIndex]) minIndex = this.heap[minIndex].timestamp > this.heap[rightIndex].timestamp ? rightIndex : minIndex
        if (!minIndex) return
        if (index !== minIndex) {
            this.swap(index, minIndex)
            this.shiftDown(minIndex)
        }
    }
    /**
     *  插入操作
     */
    insert(val) {
        this.heap.push(val)
        this.shiftUp(this.heap.length - 1)
    }
    /**
     * 删除堆顶
     */
    pop() {
        const res = this.heap[0]
        if (this.heap.length === 1) {
            this.heap.pop()
            return res
        }
        this.heap[0] = this.heap.pop()
        this.shiftDown(0)
        return res
    }
    /**
     * 获取堆的大小
     * number 堆长度
     */
    size() {
        return this.heap.length
    }
    /**
     * 获取堆顶
     */
    peek() {
        return this.heap[0]
    }

    
}


export function dataAl(){

}