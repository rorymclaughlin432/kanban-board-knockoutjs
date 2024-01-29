/*global ko*/
(function (ko) {
    var names = [
      "Complete the tutorial",
      "Test the examples",
      "Read the documentation",
      "Fix the bugs",
      "Write an article",
      "Write a book",
      "Read the Programmers Bible back to front",
    ];
  
    function toDraggables(values) {
      return ko.utils.arrayMap(values, function (value) {
        return {
          value: value,
          dragging: ko.observable(false),
          isSelected: ko.observable(false),
        };
      });
    }
  
    function getSelectedItems(items) {
      return ko.utils.arrayFilter(
        ko.utils.unwrapObservable(items),
        function (item) {
          return item.isSelected();
        }
      );
    }
  
    function getSelectedItem(item) {
      return ko.utils.arrayFilter(
        ko.utils.unwrapObservable(item),
        function (item) {
          return item.isSelected();
        }
      );
    }
  
    function clearSelection(items) {
      ko.utils.arrayForEach(ko.utils.unwrapObservable(items), function (item) {
        item.isSelected(false);
      });
    }
  
    function DragDropView(items) {
      items = items || [];
      this.todoCard = ko.observableArray([].concat(items));
      this.targetInProgress = ko.observableArray([].concat(items));
      this.targetDone = ko.observableArray([].concat(items));
    }
  
    DragDropView.prototype.select = function (item) {
      console.log(`item: ${item}`);
      clearSelection(this.todoCard);
      item.isSelected(true);
      console.log(item);
    };
  
    DragDropView.prototype.selectAll = function () {
      var items = getSelectedItems(this.todoCard);
      items = items.concat(getSelectedItems(this.targetInProgress));
      items = items.concat(getSelectedItems(this.targetDone));
      clearSelection(this.todoCard);
      clearSelection(this.targetInProgress);
      clearSelection(this.targetDone);
      ko.utils.arrayForEach(items, function (item) {
        item.isSelected(true);
      });
    };
  
    DragDropView.prototype.deleteSelected = function () {
      var items = getSelectedItems(this.todoCard);
      items = items.concat(getSelectedItems(this.targetInProgress));
      items = items.concat(getSelectedItems(this.targetDone));
      clearSelection(this.todoCard);
      clearSelection(this.targetInProgress);
      clearSelection(this.targetDone);
      ko.utils.arrayForEach(items, function (item) {
        item.isSelected(false);
      });
    };
  
    DragDropView.prototype.deleteSelectedItems = function () {
      var items = getSelectedItems(this.todoCard);
      items = items.concat(getSelectedItems(this.targetInProgress));
      items = items.concat(getSelectedItems(this.targetDone));
      ko.utils.arrayForEach(items, function (item) {
        this.todoCard.remove(item);
        this.targetInProgress.remove(item);
        this.targetDone.remove(item);
      });
    };
  
    DragDropView.prototype.addItemToToDo = function () {
      var addItem = prompt("Add a new item to To Do Card");
  
      if (addItem == null || addItem == "") {
        alert("Please enter a valid item");
        return false;
      } else if (addItem.length > 20) {
        alert("Please enter a valid item");
        return false;
      }
  
      var item = {
        dragging: ko.observable(false),
        isSelected: ko.observable(false),
        value: addItem,
      };
      this.todoCard.push(item);
    };
  
    DragDropView.prototype.log = function (item) {
      console.log(item);
    };
  
    DragDropView.prototype.deleteItemFromToDo = function () {
      var items = getSelectedItems(this.todoCard);
  
      if (items.length == 0) {
        alert("Please select an item to delete");
        return false;
      } else if (items.length == 1) {
        var deleteItem = confirm(
          `Are you sure you want to delete ${items[0].value}?`
        );
        if (deleteItem == true) {
          clearSelection(this.todoCard);
          var item = {
            dragging: ko.observable(false),
            isSelected: ko.observable(false),
            value: items,
          };
          this.todoCard.remove(items[0]);
        } else if (!deleteItem) {
          clearSelection(this.todoCard);
          items[0].isSelected(false);
        }
      } else if (items.length > 1) {
        var deleteItem = confirm(
          `Are you sure you want to delete these ${items.length} tasks?`
        );
        if (deleteItem) {
          clearSelection(this.todoCard);
          var item = {
            dragging: ko.observable(false),
            isSelected: ko.observable(false),
            value: items,
          };
          this.todoCard.removeAll(items);
          console.log(item);
        }
      }
    };
  
    DragDropView.prototype.selectToDoSingleItem = function (item) {
      if (item.isSelected() == false) {
        item.isSelected(true);
      } else if (item.isSelected()) {
        var selectItem = confirm(
          `Are you sure you want to de-select ${item.value}?`
        );
        if (selectItem) {
          item.isSelected(false);
        }
      }
    };
  
    //Dropzone process
    //To Do Card
    DragDropView.prototype.toDoToInProgress = function (data, model) {
      model.todoCard.remove(data);
      model.targetInProgress.push(data);
      console.log(data);
      console.log(model);
      console.log(model.todoCard);
      console.log(model.targetInProgress);
    };
  
    DragDropView.prototype.toDoToDone = function (data, model) {
      model.todoCard.remove(data);
      model.targetDone.push(data);
      console.log(data);
      console.log(model);
      console.log(model.todoCard);
      console.log(model.targetDone);
    };
  
    //In Progress Card
    DragDropView.prototype.inProgressMoveBackToToDo = function (data, model) {
      model.targetInProgress.remove(data);
      model.todoCard.push(data);
      console.log(data);
      console.log(model);
      console.log(model.todoCard);
      console.log(model.targetInProgress);
    };
  
    DragDropView.prototype.inProgressMoveToDone = function (data, model) {
      model.targetInProgress.remove(data);
      model.targetDone.push(data);
      console.log(data);
      console.log(model);
      console.log(model.targetDone);
      console.log(model.targetInProgress);
    };
  
    //Done Card
    DragDropView.prototype.doneBackToDo = function (data, model) {
      model.targetDone.remove(data);
      model.todoCard.push(data);
      console.log(data);
      console.log(model);
      console.log(model.todoCard);
      console.log(model.targetDone);
    };
  
    DragDropView.prototype.doneToInProgress = function (data, model) {
      model.targetDone.remove(data);
      model.targetInProgress.push(data);
      console.log(data);
      console.log(model);
      console.log(model.targetDone);
      console.log(model.targetInProgress);
    };
  
    DragDropView.prototype.dragStart = function (data) {
      data.selection = getSelectedItems(data.items);
      if (!data.item.isSelected()) {
        clearSelection(data.selection);
        data.item.isSelected(true);
        data.selection = [data.item];
      }
      ko.utils.arrayForEach(data.selection, function (item) {
        item.dragging(true);
      });
    };
  
    DragDropView.prototype.dragEnd = function (item) {
      item.dragging(false);
    };
  
    DragDropView.prototype.reordered = function (event, dragData, zoneData) {
      if (dragData !== zoneData.item) {
        var zoneDataIndex = zoneData.items.indexOf(zoneData.item);
        zoneData.items.remove(dragData);
        zoneData.items.splice(zoneDataIndex, 0, dragData);
      }
    };
  
    var mainView = {
      simple: new DragDropView(toDraggables(names)),
    };
    ko.applyBindings(mainView, document.querySelector(".board"));
  })(ko);
  