# AI Flow Workspace

Build a complete, polished, production-ready AI Productivity Assistant website that combines three AI tools into one unified application:

Smart Email Generator

Meeting Notes Summarizer

AI Task Planner / Scheduler

The website must be fully integrated so the three tools can share information and work together. Do not add authentication, login, signup, user accounts, or password functionality.

The goal is to create one simple AI productivity workspace where users can write emails, summarize meetings, extract tasks, and automatically organize those tasks into schedules.

CORE REQUIREMENT

Do not build three separate websites.

Build one application with three connected AI features.

The workflow should work like this:

Meeting Notes → Summary → Action Items → Task Planner → Schedule

and:

Meeting Notes → Follow-Up Email

and:

Task → Smart Email Generator → Email

All three tools should share the same application state.

1. WEBSITE STRUCTURE

Create the following pages/sections:

Dashboard

Smart Email Generator

Meeting Notes Summarizer

AI Task Planner

Settings

Use a modern sidebar navigation on desktop.

On mobile, convert the sidebar into a responsive navigation menu.

The user should enter directly into the Dashboard.

No authentication of any kind.

2. DASHBOARD

Create a beautiful modern dashboard.

At the top display:

AI Productivity Assistant

Subtitle:

Write smarter. Summarize meetings. Plan your day.

Display three main feature cards.

Smart Email Generator

Icon: Mail

Description:

"Generate professional emails in seconds using AI."

Button:

Open Email Generator

Meeting Notes Summarizer

Icon: FileText

Description:

"Turn long meeting notes into summaries, decisions, action items and deadlines."

Button:

Summarize Meeting

AI Task Planner

Icon: Calendar / CheckSquare

Description:

"Turn your tasks into an intelligent daily or weekly schedule."

Button:

Plan My Tasks

3. SMART EMAIL GENERATOR

Create a complete AI email-writing interface.

Input fields

What should the email say?

Large textarea:

"Describe what you want to communicate..."

Example:

"Ask my manager if I can take Friday off."

Recipient type

Dropdown:

Manager

Client

Customer

Coworker

Teacher

Friend

Other

Tone

Allow the user to select:

Professional

Formal

Friendly

Persuasive

Casual

Apologetic

Concise

Length

Short

Medium

Detailed

Additional instructions

Optional textarea.

Generate Email

Large button:

Generate Email

Show a professional loading state while the AI is generating the email.

Do not freeze the page.

4. EMAIL RESULTS

Display the generated email in a clean editable email editor.

Show:

Subject

and

Email Body

Allow users to edit both.

Add buttons:

Copy

Regenerate

Make Shorter

Make Longer

Make More Professional

Make Friendlier

Clear

Also add:

Save Email

Saved emails should be stored locally in the browser.

5. MEETING NOTES SUMMARIZER

Create a dedicated meeting-notes interface.

Input

Large textarea:

"Paste your meeting notes here..."

Include an optional file upload for supported text documents if practical.

Button:

Summarize Meeting

6. MEETING SUMMARY OUTPUT

The AI should return structured information.

Display:

Executive Summary

A short summary of the meeting.

Key Discussion Points

Bullet points.

Decisions Made

Important decisions from the meeting.

Action Items

Display a table:

TaskPersonDeadlinePriority

Important Dates

Extract dates and deadlines.

Follow-Up Items

List unresolved or future items.

7. MEETING → TASK INTEGRATION

This is extremely important.

Every extracted action item should have an:

Add to Task Planner

button.

When clicked, automatically create a task in the AI Task Planner.

For example:

Meeting notes say:

"John will complete the presentation by Friday."

Automatically create:

Task:
Complete presentation

Assigned to:
John

Deadline:
Friday

Priority:
AI-generated based on the meeting context.

The user should not have to manually re-enter the information.

Also provide:

Add All Action Items

button.

8. MEETING → EMAIL INTEGRATION

After generating a meeting summary, display:

Generate Follow-Up Email

When clicked, send the meeting information to the Smart Email Generator.

The email generator should automatically create a professional follow-up email containing:

Meeting summary

Important decisions

Action items

Deadlines

Next steps

The user can edit the email before copying it.

9. AI TASK PLANNER / SCHEDULER

Create a powerful task-management interface.

Allow users to add tasks manually.

Each task should contain:

Task name

Description

Priority

Deadline

Estimated duration

Optional assigned person

Priority:

High

Medium

Low

10. QUICK TASK INPUT

Add a simple input at the top:

What do you need to get done?

Example:

"Finish project report"

Button:

Add Task

After adding it, show it in the task list.

11. TASK LIST

Display all tasks in a clean interface.

Each task should have:

Checkbox

Task name

Priority badge

Deadline

Estimated duration

Edit button

Delete button

Allow users to mark tasks as completed.

Completed tasks should visually change.

12. SCHEDULING SETTINGS

Allow the user to configure:

Schedule

Daily

Weekly

Working hours

Start time:

09:00

End time:

17:00

Break duration

Example:

15 minutes

Lunch break

Allow the user to define lunch duration.

Planning date

Allow the user to choose a date.

13. AI SCHEDULER

Create a button:

Generate My Schedule

The AI should intelligently organize tasks based on:

Priority

Deadline

Estimated duration

Available working hours

Task dependencies where applicable

Completed tasks

User's preferred working hours

Rules:

High-priority tasks should generally be scheduled earlier.

Urgent deadlines should be prioritized.

Do not create overlapping tasks.

Do not schedule outside working hours.

Include reasonable breaks.

Avoid unrealistic schedules.

If there are too many tasks for one day, clearly identify tasks that need to move to another day.

Do not silently delete or ignore tasks.

14. SCHEDULE DISPLAY

Display the schedule as a beautiful timeline.

Example:

Tuesday, August 25

09:00 – 10:30
🔴 Finish project report

10:30 – 10:45
☕ Break

10:45 – 11:30
🟡 Reply to emails

11:30 – 12:30
🔴 Prepare presentation

12:30 – 13:30
🍴 Lunch

13:30 – 14:30
🔴 Study for exam

17:00
End of workday

Allow users to:

Complete tasks

Edit tasks

Move tasks

Delete tasks

Regenerate schedule

Add tasks

Change priority

15. TASK → EMAIL INTEGRATION

Every task should optionally have:

Draft Email

button.

For example:

Task:

"Send project update to client."

When the user clicks Draft Email, automatically open the Smart Email Generator with the task information already inserted.

Generate an appropriate professional email.

The user should then be able to edit and copy the email.

16. SHARED DATA

The three tools must share data.

Use a centralized application state.

Example data flow:

Meeting Notes
     ↓
AI Summary
     ↓
Action Items
     ↓
Task Planner
     ↓
AI Schedule


And:

Meeting Summary
     ↓
Follow-Up Email
     ↓
Smart Email Generator


And:

Task
     ↓
Draft Email
     ↓
Smart Email Generator


17. NO AUTHENTICATION

This is mandatory.

Do NOT create:

Login

Signup

Registration

Password

Forgot password

User profiles

Authentication

Account creation

The website must immediately open to the Dashboard.

18. LOCAL DATA STORAGE

Because there is no authentication, save user data locally using browser storage such as:

localStorage

Store:

Tasks

Schedules

Generated emails

Meeting summaries

User preferences

Theme preference

Data should remain after refreshing the page.

Add a Settings option:

Clear All Data

Before clearing data, show a confirmation dialog.

19. AI ARCHITECTURE

Create clean AI service functions for:

generateEmail()
summarizeMeeting()
extractActionItems()
generateSchedule()
generateFollowUpEmail()
generateTaskEmail()


Keep the AI logic separate from the UI.

Use secure environment variables for AI API keys.

Never expose private API keys in frontend source code.

Make the AI provider easy to replace later.

20. ERROR-FREE USER EXPERIENCE

The application must be designed to prevent crashes and broken states.

Handle:

Empty inputs

Invalid inputs

Network failures

AI API failures

Missing API configuration

Invalid AI responses

Very long text

Duplicate tasks

Missing deadlines

Scheduling conflicts

If an AI request fails, show a friendly message:

"We couldn't complete that request. Please try again."

Provide a:

Try Again

button.

Never leave the user staring at an infinite loading screen.

Always stop loading states when requests fail.

21. AI RESPONSE VALIDATION

Do not blindly trust AI responses.

Validate generated data before displaying it.

For structured responses such as tasks and schedules, require valid JSON/schema output.

If the AI returns invalid structured data:

Attempt to safely recover.

If recovery fails, show an error.

Allow the user to retry.

Never crash the application.

22. DESIGN

Use a premium, modern SaaS design.

Style:

Clean

Minimal

Professional

Modern

Responsive

Accessible

Use:

Rounded cards

Subtle shadows

Smooth transitions

Modern icons

Clear typography

Spacious layouts

Consistent buttons

Good visual hierarchy

Suggested colors:

Primary:
Indigo / Blue

Secondary:
Purple

Background:
White / Light Gray

Success:
Green

Warning:
Orange

High Priority:
Red

23. DARK MODE

Add a light/dark mode toggle.

Save the preference locally.

Every page and component must support dark mode consistently.

24. RESPONSIVE DESIGN

The website must work perfectly on:

Desktop

Laptop

Tablet

Mobile

Mobile requirements:

Responsive navigation

Cards stack vertically

Forms use full width

Tables become mobile-friendly

Schedule timeline can scroll

Buttons remain easy to tap

25. ACCESSIBILITY

Use:

Proper labels

Keyboard navigation

Accessible buttons

Good color contrast

ARIA labels where appropriate

Clear focus states

Do not rely only on color to communicate task priority.

26. SETTINGS

Create a simple Settings page.

Include:

Appearance

Light mode

Dark mode

Scheduling

Default working hours

Default break duration

Default schedule type

Data

Clear all local data

AI

Show AI connection/configuration status.

Do not include authentication settings.

27. EMPTY STATES

Create attractive empty states.

Email:

"Describe what you want to say and AI will create your email."

Meeting:

"Paste your meeting notes to generate a structured summary."

Tasks:

"Add your tasks and let AI organize your day."

Schedule:

"Generate a schedule from your current tasks."

28. NAVIGATION

The user should always be able to move between the tools.

For example:

Dashboard → Meeting Notes → Task Planner

Dashboard → Email Generator

Task Planner → Email Generator

Meeting Notes → Email Generator

Meeting Notes → Task Planner

Include breadcrumbs or clear navigation where useful.

29. TECHNOLOGY

Use a modern production-ready stack such as:

React

TypeScript

Next.js or equivalent

Tailwind CSS

Component-based architecture

Use reusable components.

Keep code organized and maintainable.

Suggested structure:

app/
  page
  email
  meetings
  tasks
  settings

components/
  Sidebar
  Header
  Dashboard
  EmailGenerator
  MeetingSummarizer
  TaskPlanner
  ScheduleTimeline
  TaskCard
  LoadingState
  ErrorState
  Modal

services/
  ai
  email
  meetings
  tasks
  scheduler

lib/
  storage
  validation

types/
  email
  meeting
  task
  schedule


30. FINAL REQUIREMENT

Build the website as a fully integrated AI productivity platform, not as three independent tools.

The final user experience should be:

Open website → Dashboard → Choose a tool → Use AI → Save result → Send information to another tool → Continue working.

The three main capabilities must work together:

Smart Email Generator

Creates and improves professional emails.

Meeting Notes Summarizer

Turns notes into summaries, decisions, action items and deadlines.

AI Task Planner / Scheduler

Turns tasks into prioritized schedules.

The key integrations are:

Meeting Notes → Action Items → Tasks

Meeting Notes → Follow-Up Email

Tasks → Draft Email

Tasks → AI Schedule

Make the interface polished, fast, intuitive, responsive and reliable.

There must be no authentication whatsoever.

Do not leave placeholder buttons, fake functionality, broken navigation, unfinished pages, or obvious demo-only components.

Build a complete working MVP with a professional production-quality user interface.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://flowai-workspace.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3ffbb419-5108-45fb-be76-ef7ddd013997).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
