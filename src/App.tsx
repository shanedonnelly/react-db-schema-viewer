import DataSchemaVisualizer from "./DataSchemaVisualizer";
import type { DataSchema } from "./DataSchemaVisualizer";
import "./App.css";

const exampleSchema: DataSchema = {
  entities: [
    {
      id: "user",
      name: "User",
      attributes: [
        { name: "id", type: "uuid (PK)" },
        { name: "email", type: "varchar(255)" },
        { name: "username", type: "varchar(100)" },
        { name: "password_hash", type: "varchar(255)" },
        { name: "created_at", type: "timestamp" },
        { name: "is_active", type: "boolean" },
      ],
    },
    {
      id: "profile",
      name: "Profile",
      attributes: [
        { name: "id", type: "uuid (PK)" },
        { name: "user_id", type: "uuid (FK)" },
        { name: "first_name", type: "varchar(100)" },
        { name: "last_name", type: "varchar(100)" },
        { name: "avatar_url", type: "text" },
        { name: "bio", type: "text" },
      ],
    },
    {
      id: "organization",
      name: "Organization",
      attributes: [
        { name: "id", type: "uuid (PK)" },
        { name: "name", type: "varchar(200)" },
        { name: "slug", type: "varchar(100)" },
        { name: "plan", type: "enum" },
        { name: "created_at", type: "timestamp" },
      ],
    },
    {
      id: "org_member",
      name: "OrganizationMember",
      attributes: [
        { name: "id", type: "uuid (PK)" },
        { name: "user_id", type: "uuid (FK)" },
        { name: "org_id", type: "uuid (FK)" },
        { name: "role", type: "enum" },
        { name: "joined_at", type: "timestamp" },
      ],
    },
    {
      id: "project",
      name: "Project",
      attributes: [
        { name: "id", type: "uuid (PK)" },
        { name: "org_id", type: "uuid (FK)" },
        { name: "name", type: "varchar(200)" },
        { name: "description", type: "text" },
        { name: "status", type: "enum" },
        { name: "created_at", type: "timestamp" },
      ],
    },
    {
      id: "task",
      name: "Task",
      attributes: [
        { name: "id", type: "uuid (PK)" },
        { name: "project_id", type: "uuid (FK)" },
        { name: "assignee_id", type: "uuid (FK)" },
        { name: "title", type: "varchar(300)" },
        { name: "description", type: "text" },
        { name: "priority", type: "enum" },
        { name: "status", type: "enum" },
        { name: "due_date", type: "date" },
      ],
    },
    {
      id: "comment",
      name: "Comment",
      attributes: [
        { name: "id", type: "uuid (PK)" },
        { name: "task_id", type: "uuid (FK)" },
        { name: "author_id", type: "uuid (FK)" },
        { name: "body", type: "text" },
        { name: "created_at", type: "timestamp" },
      ],
    },
    {
      id: "tag",
      name: "Tag",
      attributes: [
        { name: "id", type: "uuid (PK)" },
        { name: "org_id", type: "uuid (FK)" },
        { name: "name", type: "varchar(100)" },
        { name: "color", type: "varchar(7)" },
      ],
    },
    {
      id: "task_tag",
      name: "TaskTag",
      attributes: [
        { name: "task_id", type: "uuid (FK)" },
        { name: "tag_id", type: "uuid (FK)" },
      ],
    },
  ],
  relations: [
    { id: "r1", sourceEntityId: "user", targetEntityId: "profile" },
    { id: "r2", sourceEntityId: "user", targetEntityId: "org_member" },
    { id: "r3", sourceEntityId: "organization", targetEntityId: "org_member" },
    { id: "r4", sourceEntityId: "organization", targetEntityId: "project" },
    { id: "r5", sourceEntityId: "organization", targetEntityId: "tag" },
    { id: "r6", sourceEntityId: "project", targetEntityId: "task" },
    { id: "r7", sourceEntityId: "user", targetEntityId: "task" },
    { id: "r8", sourceEntityId: "task", targetEntityId: "comment" },
    { id: "r9", sourceEntityId: "user", targetEntityId: "comment" },
    { id: "r10", sourceEntityId: "task", targetEntityId: "task_tag" },
    { id: "r11", sourceEntityId: "tag", targetEntityId: "task_tag" },
  ],
};

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Database Schema Viewer</h1>
        <p>Project management database — interactive schema visualization</p>
      </header>
      <div className="schema-container">
        <DataSchemaVisualizer schema={exampleSchema} />
      </div>
    </div>
  );
}

export default App;
