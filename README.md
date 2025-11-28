# Task-Planner
The application aims to manage and track the progress of various tasks.  The platform is built as a Single Page Application (SPA) web app, accessible through a browser on desktop computers, mobile devices, or tablets, depending on the user’s preferences.

# Application Overview

- The application manages a set of users, including both managers and executors, and provides an administrator role for system management.
- The administrator can add new users and assign them as either managers or executors.
- Each executor is assigned to a manager.
- A manager can also be an executor for a higer-role manager
- A manager can create new tasks, each containing a clear description to ensure it can be completed effectively.
- When created, a task starts in the OPEN state.
- A manager can assign a task to an executor, changing its state to PENDING.
- Executors can view their list of assigned tasks and mark them as completed, updating the task status to COMPLETED.
- Managers can view all tasks they manage along with their current statuses.
- Once a task is completed, the manager can mark it as CLOSED.
- Each user can access their personal task history.
- Managers can also review the historical task list of any executor they oversee.

# Creating Accounts

Assuming your business wants to incorporate the application into its workflow the following steps are required for an easy and secure usage.

- An email is being sent to all the head managers of the departments in place to register an account. The email is sent through the administration portal.
- The head managers register their accounts into the application and invite their subordinates to make accounts for their specific department.
- After the departments are set each manager can then assign tasks for their subordinates using the **Assign Task** tab.

# Tabs

## Dashboard

Contains information about the department or department's tasks as well as information about individual tasks on either open or pending state.
The administrator(s) can see different dashboards for all the departments in place while head managers can only see for their own department.
On the Dashboard tab you can also filter information based on time, people, teams or category of task.


## Assigning Tasks

Assigning task tab contains a few required fields to complete:

- Asignee - person who asigns the task
- Asigned - person / teams who has the taks asigned to them. A task can be assigned to more than 1 person for more complex operations
- Roles (optional) - in case of team assignments the role of each individual can be specified to make workflow easier
- Deadline - when the task starts and when it ends
- Description - description of what the task is and what it consists of
- Subtasks (optional) - for more complex tasks these can be broken down into subtasks that each member can take care of. Each of them can have an individual deadline
- Category (optional) - a category assigned for the task being done (e.g: financial, reports)

## History

Different from the Dashboards tab, the History tab allows you to view detailed information about each task that has already been **CLOSED**.
You can view all the information discussed above on the **assigning tasks** tab.

To export the History logs you can do so using the **Export** button. 
