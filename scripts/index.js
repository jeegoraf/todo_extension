document.addEventListener('DOMContentLoaded', function () {
  const state = getStoredStateOrDefault({ 
    counter: 0
  })

  class Task{
    constructor(text, checked=false, id){
      this.text = text
      this.checked = checked
      this.id = id
      this.picked = false;
    }
  }

  let tasks_list = []

  let flag = false;

  if (localStorage.getItem('tasksList') != ''){
    tasks_list = JSON.parse(localStorage.getItem('tasksList'))
  }

  let $tasks = document.querySelector('.tasks')
  

  let count_tasks = 0

  let $checked_tasks = 0

  let $percent = 0

  const $gauge = document.querySelector('.gauge')
  setGaugePercent($gauge, 0)

  const $task = document.querySelector('.next-task')

  refreshList(tasks_list)

  localStorage.setItem('tasksList', JSON.stringify(tasks_list))

  if ((tasks_list.length == 0) & (flag == false)){

    let $tasks_count = document.querySelector('.tasks_count')
    let img = document.createElement('img')
    img.src = 'images/start_img.svg'

    let container = document.querySelector('.container');
    $tasks.appendChild(img);
    container.removeChild($gauge);

    $tasks_count.innerHTML = ''

    let text = document.createElement('div')
    text.innerHTML = 'What\'s up, ma boi?'
    text.classList.add('clear_text-hello')
    $tasks.classList.remove('tasks')
    $tasks.classList.add('tasks-clean')
  
    
    $tasks.append(text)

    let text_below = document.createElement('div')
    text_below.innerHTML = 'Okay, here we go ...'
    text_below.classList.add('clear_text-below')

    $tasks.append(text_below)

    
  }



 

 
 

  $task.addEventListener('keydown', function(event){
    if (event.code == 'Enter'){
      if (document.querySelector('.gauge') == null){
        $tasks.innerHTML = '';
        let container = document.querySelector('.container')
        let $tasks_count = document.querySelector('.tasks_count')
        container.insertBefore($gauge, $tasks_count)
        $tasks.classList.remove('tasks-clean')
        $tasks.classList.add('tasks')
        
        
      }
      let task = new Task($task.value, false, tasks_list.length)
      addTask(task)
      tasks_list.push(task)

      refreshList(tasks_list)

      let $tasks_count = document.querySelector('.tasks_count')
      $tasks_count.innerHTML = String(count_tasks) + ' tasks to do';
    }

  })

  let new_day = document.querySelector('.new_day');
  new_day.addEventListener('click', function(){
    let new_tasks = []
    let curID = 0
    for (let i = 0; i < tasks_list.length; i++){
      if (tasks_list[i].picked == true){
        new_tasks.push(tasks_list[i]);
        new_tasks[curID].id = curID;
        new_tasks[curID].picked = false;
        curID += 1
      }
    }
    tasks_list = new_tasks;
    refreshList(tasks_list);

    if (tasks_list.length == 0){
      let $tasks_count = document.querySelector('.tasks_count')
      let img = document.createElement('img')
      img.src = 'images/start_img.svg'

      let container = document.querySelector('.container');
      $tasks.appendChild(img);
      container.removeChild($gauge);

      $tasks_count.innerHTML = ''

      let text = document.createElement('div')
      text.innerHTML = 'What\'s up, ma boi?'
      text.classList.add('clear_text-hello')
      $tasks.classList.remove('tasks')
      $tasks.classList.add('tasks-clean')
  
    
      $tasks.append(text)

      let text_below = document.createElement('div')
      text_below.innerHTML = 'Okay, here we go ...'
      text_below.classList.add('clear_text-below')

      $tasks.append(text_below)
      
      
      
    }
  })

  function addTask(task){

    let newTask = document.createElement("div");
    newTask.classList.add("tasks-task");
    newTask.id = task.id
    
  
    let newTaskCheck = document.createElement("div");
    newTaskCheck.classList.add("tasks-task_check");
  
    let input = document.createElement("input");
    input.type = "checkbox";
    input.onchange = check_over;
    input.classList.add("custom-checkbox");
    input.checked = task.checked

    newTask.onclick = choose;
    
    input.id = 'check' + task.id
  
    input.name = "check" + task.id;
    input.value = "yes";
  
    newTaskCheck.appendChild(input);
  
    let label = document.createElement("label");
    label.htmlFor = "check" + task.id;
    label.innerHTML = task.text;

   
    if (input.checked == true){
      label.classList.add('label-checked')
    }

    if (task.picked == true){
      newTask.classList.add('tasks-task__chosen')
    }

    newTaskCheck.appendChild(label);
  
    newTask.appendChild(newTaskCheck);
  
    let del = document.createElement("button");
    del.onclick = delTask;
    del.type = "button";
    del.style = "border: 0px; background-color: #F1F2F6;";
  
    let del_img = document.createElement("img");
    del_img.src = "images/delete.svg";
    del_img.style = "margin-top: 3px;";
    del_img.classList.add("delete");
    del.appendChild(del_img);
  
    newTask.appendChild(del);
  
    
  
    if (task.text != ""){
      $tasks.append(newTask)
      $task.value = ""
      setGaugePercent($gauge, 0)        
    }

    if (task.checked == true){
      $checked_tasks += 1
    }

    else if (task.checked == false){
      count_tasks += 1
    }
  
    
  
    $percent = Math.round(100*$checked_tasks/($checked_tasks + count_tasks + 1))
    
    setGaugePercent($gauge, $percent)

    
  }

  function delTask(){

    flag = true;


    window.event.stopPropagation();

    let $input = this.previousSibling.firstChild

    let taskID = $input.id.length

    taskID = $input.id[taskID - 1]


    tasks_list.splice(taskID, 1)

    console.log(tasks_list)

    for (let i = taskID; i < tasks_list.length; i++){
      tasks_list[i].id -= 1
    }
    
    refreshList(tasks_list)

    if ((tasks_list.length == 0) & (flag == true)){

      let $tasks_count = document.querySelector('.tasks_count')
      let img = document.createElement('img')
      img.style = "margin-top: -75px;"
      img.src = 'images/all_done.svg'
  
      let container = document.querySelector('.container');
      console.log(container.childNodes)
      $tasks.appendChild(img);
      container.removeChild($gauge);
  
      console.log(container);
      $tasks_count.innerHTML = ''
  
      let text = document.createElement('div')
      text.innerHTML = 'Good job, my friend!'
      text.classList.add('clear_text-hello')
      $tasks.classList.remove('tasks')
      $tasks.classList.add('tasks-clean')
    
      
      $tasks.append(text)
  
      let text_below = document.createElement('div')
      text_below.innerHTML = 'What time is it? Beer time!'
      text_below.classList.add('clear_text-below')
  
      $tasks.append(text_below)
  
      return
    }

  }


  function check_over(){

    window.event.stopPropagation();
   
    console.log('check_over')
    let $input = this
    console.log($input)
    let $label = this.nextSibling
    let $tasks_count = document.querySelector('.tasks_count')

    let taskID = $input.id.length
    
    taskID = $input.id[taskID - 1]

    if ($input.checked == true){

      tasks_list[taskID].checked = true

      $checked_tasks += 1
      count_tasks -= 1
      $label.classList.add('label-checked')
      $tasks_count.innerHTML = String(count_tasks) + ' tasks to do';
      
      $percent = Math.round(100*$checked_tasks/($checked_tasks + count_tasks))
      setGaugePercent($gauge, $percent)

      refreshList(tasks_list)

    } 

    else{


      tasks_list[taskID].checked = false

      $checked_tasks -= 1
      count_tasks += 1
      $label.classList.remove('label-checked')
      $tasks_count.innerHTML = String(count_tasks) + ' tasks to do';

      $percent = Math.round(100*$checked_tasks/($checked_tasks + count_tasks))
      setGaugePercent($gauge, $percent)

      refreshList(tasks_list)

      
    }

    
  }

  function refreshList(items){

  
    let $tasks_count = document.querySelector('.tasks_count')
    if (items.length == 0){
      $tasks_count.innerHTML =  '0 tasks to do';
      setGaugePercent($gauge, 0)
      $tasks.innerHTML = ''
      localStorage.setItem('tasksList', [])
      return
    }
    

    new_tasks = []

    $tasks.innerHTML = ''

    count_tasks = 0
    $checked_tasks = 0


    for (let i = 0; i < items.length; i++){
      addTask(items[i])
      new_tasks.push(items[i])
    }    

    tasks_list = new_tasks

    $percent = Math.round(100*$checked_tasks/($checked_tasks + count_tasks))


    $tasks_count.innerHTML = String(count_tasks) + ' tasks to do';

    if (isNaN($percent) == true){
      setGaugePercent($gauge, 0)
      return
    }

    setGaugePercent($gauge, $percent)


    let list = JSON.stringify(items)
    localStorage.setItem('tasksList', list)
    
  }

  function choose(){

    let $input = this
    console.log("choose")
    console.log(this);
    let taskID = $input.id.length
    taskID = $input.id[taskID - 1]

    if (tasks_list[taskID].picked == false){
      tasks_list[taskID].picked = true
      this.classList.add('tasks-task__chosen')
    }
    else{
      tasks_list[taskID].picked = false
      this.classList.remove('tasks-task__chosen')
    }

    // refreshList(tasks_list)
  }
  

 

})






