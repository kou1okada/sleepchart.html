/** @file
 * file-droppable
 * Copyright (c) 2018 Koichi OKADA. All rights reserved.
 * This script is distributed under the MIT license.
 * http://www.opensource.org/licenses/MIT
 */
class FileDroppable {
  static attach(e, handlers) {
    console.log("set: fileDroppable");
    e.addEventListener("dragover" , FileDroppable.onDragOver);
    e.addEventListener("dragleave", FileDroppable.onDragLeave);
    if (handlers == null) handlers = {};
    ;      if (handlers.filereaderload != null) {
      console.log("set: fileDroppable: custom: filereaderload");
      e.addEventListener("change" , FileDroppable.onChangeFactory(FileDroppable.onFileReaderLoadFactory(handlers.filereaderload)));
      e.addEventListener("drop"   , FileDroppable.onDropFactory(  FileDroppable.onFileReaderLoadFactory(handlers.filereaderload)));
    } else if (handlers.files          != null) {
      console.log("set: fileDroppable: custom: files");
      e.addEventListener("change" , FileDroppable.onChangeFactory(handlers.files));
      e.addEventListener("drop"   , FileDroppable.onDropFactory(  handlers.files));
    } else {
      console.log("set: fileDroppable: OnlyLogging");
      e.addEventListener("change" , FileDroppable.onChangeFactory(FileDroppable.onFileReaderLoadFactory(FileDroppable.onFileReaderLoadOnlyLogging)));
      e.addEventListener("drop"   , FileDroppable.onDropFactory(  FileDroppable.onFileReaderLoadFactory(FileDroppable.onFileReaderLoadOnlyLogging)));
    }
    console.log("set: fileDroppable: success");
    
    return e;
  }
  
  static onDragOver(e) {
    if (e.currentTarget.lazyDragLeave) {
      clearTimeout(e.currentTarget.lazyDragLeave);
      delete e.currentTarget.lazyDragLeave;
    }
    e.currentTarget.classList.add("dragover");
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  static onDragLeave(e) {
    if (!e.currentTarget.lazyDragLeave) {
      e.currentTarget.lazyDragLeave = setTimeout((currentTarget)=>{
        currentTarget.classList.remove("dragover");
        delete currentTarget.lazyDragLeave;
      }, 0, e.currentTarget);
    }
    e.stopPropagation();
    e.preventDefault();
  }

  static onDropFactory(onFiles) {
    return function(e) {
      FileDroppable.onDragLeave(e);
      return onFiles(e.dataTransfer.files);
    };
  }

  static onChangeFactory(onFiles) {
    return function(e) {
      return onFiles(e.currentTarget.files);
    };
  }

  static onFileReaderLoadFactory(onFileReaderLoad) {
    return function(files) {
      console.log(files);
      //console.log(files.length);
      for (var i = 0; i < files.length; i++) {
        console.log(files[i]);
        (function(file) {
          var reader = new FileReader();
          reader.addEventListener("load", function(e) {
            return onFileReaderLoad(e, file);
          });
          reader.readAsText(file);
        })(files[i]);
      }
    };
  }
  
  static onFilesOnlyLogging(files) {
    console.log(files);
  }
  
  static onFileReaderLoadOnlyLogging(e, file) {
    console.log(file.name);
    console.log(e.currentTarget.result);
  }
}

window.addEventListener("load", ()=>{
  document.body.appendChild(Object.assign(document.createElement("link"), {
    href: "file-droppable.css",
    rel:  "stylesheet",
    type: "text/css",
  }));
});
