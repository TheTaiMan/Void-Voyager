---
title: An assessment of my project's UI
author: Miah Tayen (tayenm@myumanitoba.ca)
date: Winter 2026
---

# Phase 1
Here's my entire UI for phase 1:
![[Phase 1 Design.png]]

### Phase 1 Visibility
This UI implementation has poor visibility for the following reasons:

- **Unclear Actions:** The interface does not clearly explain button behaviors. It is not obvious that clicking "Engage Thrusters" increases the main header's number by the "Distance per click" value.
    
- **Ambiguous State:** Users cannot determine the system's current state from the screen alone and must rely on trial and error.
    
- **Unclear Values:** The "+" sign on the upgrade buttons is ambiguous. It does not specify whether it adds to the main total or to the "Distance per click" rate.
    

### Phase 1 Feedback
The UI provides good feedback. _(Note: Only happy-path feedback exists right now, as upgrades cost nothing in Phase 1)._

- **Immediate System Reaction:** Pressing "Engage Thrusters" instantly increases the main header number.
    
- **Clear Results:** Pressing any upgrade button instantly updates the "Distance per click" value.
    

### Phase 1 Consistency
The UI has passable physical consistency but poor abstract consistency:

- **Physical Consistency:** The buttons are visually consistent, as they all use the default browser styling.
    
- **Inconsistent Verbs:** Unlike "Engage Thrusters," the upgrade buttons ("Jump Drive" and "Hyperdrive") use nouns instead of actionable verbs. More consistent labels would be "Buy Jump Drive" and "Buy Hyperdrive."
    
- **Layout Inconsistency:** The interface lacks proper grouping. The upgrade buttons should be visually separated under their own header so users do not assume all three buttons perform the same type of action.


# Phase 2 
Here are the major new parts of my interface for phase 2:

**Login In / Sign-up Screen:**
![[Login and Sign Up Screen.png]]

**Main Screen:**
![[Main Screen.png]]

**Error Message for Login**
![[Name Taken Error.png]]

![[Invalid Login.png]]

**Error Message for Upgrades**
![[Upgrade Error Message.png]]

### Changes from phase 1
1. **Authentication & User State**
    - Added login/registration.
    - Display active user on main screen.

2. **Layout & Organization** 
    - Added section headers for store categories.

3. **Clarified Terminology**
    - Labeled main stat as "Distance."

4. **New Features**
    - Added autopilots (auto-clickers) to automate distance generation.


### Phase 2 Visibility
This updated UI implementation has improved visibility for the following reasons:

- **Clear System State:** The login and registration screens clearly indicate the user's status. Once logged in, the UI displays the user's name and their specific "Distance" traveled, removing guesswork about whose session is active.
    
- **Explicit Stat Tracking:** The interface clearly displays the "Per Thrust" and "Speed" metrics. Clicking "Engage Thrusters" directly increases the total distance based on the visible "Per Thrust" value, making the core mechanics visually apparent.
    
- **Visible Costs but Ambiguous Outcomes:** Upgrade costs are clearly displayed, so users immediately know what they can afford. The UI differentiates outcomes using a multiplication sign ($\times$) for Autopilot rates and an addition sign ($+$) for Propulsion "Per Thrust" increases. However, the exact outcomes remain slightly unclear, upgrades do not increase the "Speed" stat as the thematic naming implies, requiring users to guess exactly how the $+$ and $\times$ modifiers apply.
    

### Phase 2 Feedback
The updated UI provides stronger feedback for both positive and negative system states:

- **Authentication Feedback:** Successful login or registration immediately transitions the user to their personalized dashboard. If a user enters incorrect credentials, an explicit error message indicates that the username or password was invalid.
    
- **Purchasing Error Feedback:** Unlike Phase 1, a failed purchase can occur. Attempting to buy a "Propulsion Upgrade" or "Autopilot" without sufficient distance triggers an explicit error explaining the rejection.
    
- **Automated System Feedback:** Purchasing an "Autopilot" causes the distance counter to increase automatically, clearly showing that the automated upgrade is active.
    

### Phase 2 Consistency
The updated UI has improved physical and abstract consistency:

- **Layout and Grouping:** The layout is physically consistent. Clear headers separate manual "Propulsion Upgrades" from automated "Autopilots," logically grouping store items and preventing users from assuming all buttons perform the same action.
    
- **Clear Separation of Concerns:** The main action area (user and distance) is distinctly separated from the store menus. This establishes a consistent rule that statistics and store purchases live in their own designated spaces.
    
- **Consistent Abstract Flows:** Purchasing actions demonstrate strong abstract consistency. Buying a "Propulsion Upgrade" or an "Autopilot" follows the exact same interactive flow: click the button, spend distance points, and see the stat update. Learning to purchase an item in one category instantly teaches the user how to purchase in the other.
