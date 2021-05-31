# PlatformEventNotifications
Use declarative tools like Flows and Processes to send toast notifications 🍞🔔 and/or confetti 🎊 to your Salesforce users.

Note: refer to [Salesforce's messaging documentation](https://www.lightningdesignsystem.com/guidelines/messaging/components/toasts/ "Salesforce's messaging documentation") for toasts before implementing your own - this ensures users receive consistent feedback methods and that you are aligned to the Lightning Design system.
## Installation
1. Clone/download files in repo
2. Use your favourite metadata management tool to add the files to your local project's metadata and push to your org.
3. Drag and drop the newly added 'notification' LWC onto a lightning page that you want the toasts to appear on. The component functionally is invisible, and it's recommended to add it to the bottom of the page, but NOT in a tab/accordian section - this ensures it will always fire as expected.
4. Create a process or flow that will create a Notification__e record (aka fire the Notification platform event), passing in the following parameters:

| Parameter  | Expected Input  | Description |
| ------------ | ------------ | -----|
| Confetti?  | boolean (true or false)   |  Depending on if you want confetti to appear alongside the toast. |
| Title | string  | Whatever string you want to appear as the toast's title. |
| Message  | string   | Whatever string you want to appear in the body of the toast. |
|  Mode | enum ('dismissable', 'sticky', 'pester')  | See [here](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/use_toast "here") for more information. |
|  Variant | enum ('info', 'warning', 'success', 'error')  | See [here](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/use_toast "here") for more information. |
|  RecipientId |  string (18 char) | The 18 digit id of the user who should receive the message. Often will be the current user e.g. CASESAFEID($User.Id). |
|  RecordId |  string (18 char) | Not required, but if your use case involves sending a record id (or any string) in the platform event, feel free to populate this


## Limitations/Defects
- I'm sure there is an issue or two but I don't know about them yet!
- I haven't experimented too much, but I don't think you can include links in the message body even if you insert a link via e.g. a flow text template. I think this is expected behaviour but might be an area to investigate.
- You can add this component to a utility bar, but it'll only fire a notification if it's 'open'. This could be an easy way to let users opt in to notifications globally, but I suspect this isn't as useful.

## Examples
The finished product:

![image1](/images/toast.PNG)

Flow setup:

![image2](/images/flow.PNG)

Process Builder setup:

![image3](/images/pb.PNG)

## Use cases
- After saving a record, alerting users that a record meets (or doesn't meet) certain criteria without using a validation rule
e.g. 'Record has all required information added and is ready to be submitted for approval'
- Adding confetti to messages where celebrations are in order!
e.g. 'You closed this case within 5 minutes of it being created, great job!'
- Allows for a centralised toast-sending framework, where many LWCs, Flows, integrations, or other platform event-creating methods can all use the same approach for sending toasts.
