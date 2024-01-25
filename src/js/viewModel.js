/*global ko*/
(function (ko) {

    function toDraggables(values) {
      return ko.utils.arrayMap(values, function (value) {
        return {
          value: value,
          dragging: ko.observable(false),
          isSelected: ko.observable(false)
        };
      });
    }
  
    var names = [
      "Complete the tutorial",
      "Test the examples",
      "Read the documentation",
      "Fix the bugs",
      "Write an article",
      "Write a book",
      "Read the Programmers Bible back to front",
    ];
  
    function clearSelection(items) {
      ko.utils.arrayForEach(ko.utils.unwrapObservable(items), function (item) {
        item.isSelected(false);
      });
    }
  
    function extendConstructor(Constructor) {
      function ExtendedConstructor() {
        Constructor.apply(this, arguments);
      }
      ko.utils.extend(ExtendedConstructor.prototype, Constructor.prototype);
      return ExtendedConstructor;
    }
  
    function DragDropView(items) {
      items = items || [];
      this.todoCard = ko.observableArray([].concat(items));
      this.targetInProgress = ko.observableArray();
      this.targetDone = ko.observableArray();
    }
  
    var SimpleView = extendConstructor(DragDropView);

    //Dropzone process
    //To Do Card
    SimpleView.prototype.toDoToInProgress = function (data, model) {
      model.todoCard.remove(data);
      model.targetInProgress.push(data);
    };
  
    SimpleView.prototype.toDoToDone = function (data, model) {
      model.todoCard.remove(data);
      model.targetDone.push(data);
    };
  
    //In Progress Card
    SimpleView.prototype.inProgressMoveBackToToDo = function (data, model) {
      model.targetInProgress.remove(data);
      model.todoCard.push(data);
    };
  
    SimpleView.prototype.inProgressMoveToDone = function (data, model) {
      model.targetInProgress.remove(data);
      model.targetDone.push(data);
    };
  
    //Done Card
    SimpleView.prototype.doneBackToDo = function (data, model) {
      model.targetDone.remove(data);
      model.todoCard.push(data);
    };
  
    SimpleView.prototype.doneToInProgress = function (data, model) {
      model.targetDone.remove(data);
      model.targetInProgress.push(data);
    };
  
    var StylingView = extendConstructor(SimpleView);
  
    StylingView.prototype.dragStart = function (item) {
      item.dragging(true);
    };
  
    StylingView.prototype.dragEnd = function (item) {
      item.dragging(false);
    };
  
    function DragDropArea(items) {
      items = items || [];
      this.items = ko.observableArray([].concat(items));
    }
  
    DragDropArea.prototype.drop = function (data, model) {
      clearSelection(data.selection);
      data.items.removeAll(data.selection);
      ko.utils.arrayPushAll(model.items, data.selection);
    };
  
    var mainView = {
      simple: new SimpleView(names),
      dragElement: new SimpleView(names),
      payload: {
        todoCard: new DragDropArea(toDraggables(names)),
        targetInProgress: new DragDropArea(),
        targetDone: new DragDropArea(),
      },
    };
    ko.applyBindings(mainView, document.querySelector(".board"));
  })(ko);
  