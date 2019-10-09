function Queue() {
    this._index = 0;
    this._storage = {};
}

Queue.prototype.size = function () {
    return Object.keys(this._storage);
};

Queue.prototype.enqueue = function (data) {
    this._storage[this._index] = data;

    return this._index++;
};

Queue.prototype.dequeue = function (index = this._index) {
    const deletedData = this._storage[index];

    delete this._storage[index];
    this._index++;

    return deletedData;
};

Queue.prototype.getStorage = function() {
    return this._storage;
};

export default Queue;