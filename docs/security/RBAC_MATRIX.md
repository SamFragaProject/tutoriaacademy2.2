# RBAC Matrix — TutoriA Academy

| Resource      | Action         | Alumno | Docente | Director | Admin |
|---------------|----------------|:------:|:-------:|:--------:|:-----:|
| Auth          | login/refresh  |   X    |    X    |    X     |   X   |
| Users (self)  | read/update    |   X    |    X    |    X     |   X   |
| Groups        | list/read      |        |    X    |    X     |   X   |
| Groups        | create/update  |        |         |    X     |   X   |
| Students      | list/read      |        |    X    |    X     |   X   |
| Topics        | list/read      |   X    |    X    |    X     |   X   |
| Items (bank)  | search/read    |        |    X    |    X     |   X   |
| Items (bank)  | create/update  |        |    X    |          |   X   |
| Exams         | list/read      |   X*   |    X    |    X     |   X   |
| Exams         | create/update  |        |    X    |          |   X   |
| Assignments   | create/read    |        |    X    |    X     |   X   |
| Submissions   | create/read    |   X    |    X    |    X     |   X   |
| Results       | read           |   X*   |    X    |    X     |   X   |
| Documents     | upload/index   |        |         |          |   X   |
| Emails        | send           |        |    X    |    X     |   X   |

Notas:
- `Exams` y `Results` para alumno con alcance restringido a sus propios envíos.
- Director puede crear/actualizar `Groups` a nivel escuela; Docente no.
- `Items` creación/edición bloqueado para alumno/director por defecto (se puede abrir con policy).