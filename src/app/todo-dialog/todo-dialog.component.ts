export interface TodoDialogData {
  todo?: TODO;
  mode: string; // 'create' | 'update'
}

@Component({
  selector: 'todo.dialog',
  templateUrl: 'todo.dialog.html',
  styleUrls: ['./todo.dialog.css']
})
export class TodoDialog implements OnInit {

  todoForm:     FormGroup;
  name:         string;
  type:         string;
  dependencies: TODO;
  description:  string;
  types: string[]  = [];
  todoList: TODO[] = [];

  constructor(private formBuilder: FormBuilder,
              public todoService: TodoService,
              public dialogRef: MatDialogRef<TodoDialog>,
              @Inject(MAT_DIALOG_DATA) public data: TodoDialogData) {
  }

  ngOnInit() {
    this.todoService.getTodos().subscribe(todos => this.todoList = todos);
    this.todoService.getTypes().subscribe(types => this.types = types);

    this.todoForm = this.formBuilder.group({
      id:           [this.data.todo?.id],
      name:         [this.data.todo?.name        , [Validators.required]], // new FormControl(this.event.title),
      type:         [this.data.todo?.type        , [Validators.required]],
      dependencies: [this.data.todo?.dependencies, []],
      description:  [this.data.todo?.description , []]
    });
  }

  save(): void {
    this.todoService.updateTodoList(this.todoForm.value, this.data.mode);
    this.dialogRef.close(this.todoForm.value);
  }
}
