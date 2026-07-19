export const apprenticeLessonContent = {
  "welcome-to-osiris-cyber-academy": `LEARNING OBJECTIVES

By the end of this lesson, you will be able to:
• Explain how lessons, Training City missions, and capstone tickets work together.
• Describe the evidence-first habits expected from every Osiris learner.
• Recognize the limits of an authorized training environment.
• Identify the requirements for your first promotion.

WELCOME TO YOUR FIRST ROLE

You are entering Osiris Cyber Academy as a Cybersecurity Apprentice. An apprentice is not expected to know every tool or solve every incident immediately. You are expected to be curious, careful, honest about what you observe, and willing to follow a repeatable process.

Osiris is designed around a simulated workplace rather than a collection of disconnected videos. You will learn a concept, practice it in a controlled environment, make a decision with evidence, document what happened, and then apply those habits in a promotion capstone. This is the same pattern used by strong IT and cybersecurity teams: learn the system, observe its behavior, make a controlled change, verify the result, and record the outcome.

THE OSIRIS TRAINING LOOP

1. Learn the concept.
Lessons give you the vocabulary and mental model needed for the task. Read for understanding, not just completion. When a term is unfamiliar, connect it to an example. The goal is to explain the idea in your own words.

2. Practice the decision.
Mission Training City turns technical systems into a visual town. Houses represent endpoints, business buildings represent servers, roads represent network paths, doors represent ports, guards represent firewall rules, cameras represent logs, the bank represents sensitive data, and the police station represents the security operations center. The metaphor helps you see how controls work together before the technology becomes more complex.

3. Test the result.
A control is not proven simply because it was selected. You will launch a simulated attack or run a validation step to see whether the risky path is blocked while authorized work still functions. Testing both the security outcome and the business outcome is an important professional habit.

4. Document the evidence.
Your after-action reviews and ticket notes should say what you observed, what you changed, how you tested it, and what the final result was. Another technician should be able to understand your reasoning without asking you to start over.

5. Earn the promotion.
Your first promotion requires six Apprentice lessons, the Open SSH Door mission in Training City, and the Orientation Center capstone ticket. XP records your activity, but promotion is based on completing the required work. The capstone checks whether you can assess risk, choose appropriate controls, validate the solution, and communicate a clear closure note.

EVIDENCE BEFORE ASSUMPTIONS

Technical work often begins with an incomplete statement such as “the internet is down” or “this login looks suspicious.” Treat the statement as a starting point, not a conclusion. Ask what happened, when it began, who or what is affected, what changed, and what evidence supports the report.

Separate facts from hypotheses. “The server recorded 42 failed SSH logins from one public address” is an observation. “The server has been compromised” is a hypothesis that requires more evidence. Good analysts keep those categories separate so they do not overreact, overlook alternatives, or write inaccurate reports.

AUTHORIZED AND ETHICAL PRACTICE

Cybersecurity skills can affect real systems and real people. Only test systems that are explicitly included in your approved scope. Osiris simulations are authorized training environments. A technique demonstrated here is not permission to try it against a public website, another person's device, an employer's system, or any environment that has not given you clear authorization.

If the scope is unclear, pause. Review the mission instructions or escalate the question. Never hide an action, bypass a safety control, or continue simply because the action is technically possible. Professional trust depends on staying inside the rules even when no one appears to be watching.

HOW TO APPROACH KNOWLEDGE CHECKS

The quiz at the end of each Apprentice lesson includes multiple questions. Answer every question correctly to complete the lesson. The questions use short workplace scenarios because job performance depends on applying a concept, not only recalling a definition. If an answer is incorrect, return to the relevant section, identify the evidence in the scenario, and try again.

APPRENTICE FIELD CHECK

Imagine that a mission asks you to protect a server with an open network port. Before selecting controls, write four short notes:
• Observation: What condition is visible?
• Risk: What could happen if the condition remains?
• Action: What control would reduce the risk?
• Validation: What test would prove the control worked?

This four-part pattern will appear throughout Osiris.

KEY TAKEAWAYS

• Osiris follows a learn, practice, test, document, and promote cycle.
• Evidence is different from an assumption.
• Every technical action must stay within authorized scope.
• A professional record includes the symptom, evidence, action, validation, and outcome.
• Your first promotion requires all six Apprentice lessons, the Open SSH Door mission, and the capstone ticket.`,

  "what-is-a-computer": `LEARNING OBJECTIVES

By the end of this lesson, you will be able to:
• Trace how input becomes processed information, stored data, and output.
• Explain the jobs of the CPU, RAM, storage, motherboard, network adapter, and peripherals.
• Distinguish volatile memory from persistent storage.
• Collect useful workstation details before troubleshooting.

A COMPUTER IS A SYSTEM

A computer receives input, processes instructions, stores data, and produces output. These four functions happen through a collection of components that depend on one another. A support technician should avoid treating the computer as one mysterious box. Breaking it into parts makes symptoms easier to understand.

Suppose a user opens a payroll report. The keyboard and mouse provide input. The operating system and application supply instructions. The CPU executes those instructions. RAM holds the active application and report data so the CPU can reach them quickly. The storage device retains the saved file. The display produces visual output. If the report is downloaded from a server, the network adapter sends and receives the data.

CORE COMPONENTS

CPU: the processor
The central processing unit executes instructions and coordinates calculations. CPU utilization rises when applications perform demanding work. A system with sustained high CPU use may respond slowly, but high utilization alone does not tell you why. You still need to identify which process is using it and what that process is doing.

RAM: active working memory
Random access memory holds data and instructions that the computer is actively using. RAM is fast but volatile, which means its contents disappear when power is removed. When available RAM is exhausted, the operating system may move some working data to much slower storage. This can make a workstation feel frozen when many applications or browser tabs are open.

Storage: persistent data
Solid-state drives and hard disk drives retain the operating system, applications, and saved files when power is removed. Storage capacity describes how much can be retained. Storage performance describes how quickly it can be read or written. A nearly full system drive can interfere with updates, temporary files, application behavior, and overall performance.

Motherboard and firmware
The motherboard connects the processor, memory, storage, network interfaces, and other devices. Firmware such as BIOS or UEFI initializes hardware and starts the process of loading the operating system. Hardware compatibility and firmware configuration matter when a device fails to start or does not recognize a component.

Network adapter
A wired or wireless network interface allows the computer to communicate with other systems. It has hardware and software settings, including a MAC address, driver, connection state, and IP configuration supplied by the operating system. A network problem can come from the adapter, the local connection, the assigned configuration, or a service farther away.

Peripherals and ports
Monitors, keyboards, mice, headsets, cameras, printers, and external drives are peripherals. They connect through physical interfaces such as USB, HDMI, Bluetooth, or network connections. Always confirm power, cable condition, connection type, and whether the operating system recognizes the device before assuming the peripheral is broken.

HARDWARE, SOFTWARE, DATA, AND USERS

Hardware is the physical equipment. Software is the collection of instructions that runs on the hardware. Data is the information created, processed, transmitted, and stored. Users and service accounts are identities that receive permission to interact with those resources.

These categories are connected. A user may report an application problem, but the cause could be insufficient memory, full storage, a missing permission, a stopped background service, or a failed network connection. Good troubleshooting starts with the symptom and gathers enough evidence to determine which layer is involved.

VOLATILE AND NONVOLATILE DATA

The distinction between RAM and storage explains many everyday events. An unsaved document may disappear after a power loss because the newest changes existed only in volatile memory. A saved document remains because it was written to persistent storage. Applications also create temporary files and caches, so not every item on storage is intended to remain forever.

Never assume that deleting files is a harmless way to fix a space problem. Confirm ownership, business value, retention requirements, backup status, and authorization before removing data.

THE ASSET RECORD

Before working on a device, identify it accurately. Useful details include:
• Hostname or asset tag.
• Assigned user or department.
• Device type and manufacturer.
• Operating system and version.
• CPU, installed RAM, and storage capacity.
• Network adapter and current connection.
• Security tools and update status.
• The exact symptom, time observed, and recent changes.

This record prevents work on the wrong asset and gives other teams useful context. In a security incident, accurate asset identity also helps determine what data and accounts may be affected.

APPRENTICE FIELD CHECK

A user says a laptop becomes slow after opening twelve browser tabs, a video meeting, and a spreadsheet. Task Manager shows memory at 96 percent, CPU at 34 percent, and disk space at 40 percent free. The strongest first hypothesis is memory pressure, because the evidence matches the symptom. Close or suspend an unnecessary application, observe memory use, and see whether responsiveness improves. Do not replace the computer or delete files without evidence.

KEY TAKEAWAYS

• A computer is a connected system of input, processing, memory, storage, networking, and output.
• The CPU executes instructions; RAM holds active working data; storage retains saved data.
• A symptom reported in software can have a hardware, identity, network, or configuration cause.
• Record the exact asset and evidence before making changes.
• Protect user data and obtain authorization before destructive actions.`,

  "operating-systems-explained": `LEARNING OBJECTIVES

By the end of this lesson, you will be able to:
• Explain how an operating system manages hardware and software resources.
• Distinguish applications, processes, and services.
• Describe files, folders, accounts, permissions, and logs.
• Apply least privilege and evidence-based investigation to common OS issues.

THE OPERATING SYSTEM'S JOB

An operating system sits between hardware, applications, and users. Windows, Linux, and macOS look different, but each performs the same core jobs: managing processors and memory, controlling devices, organizing files, running processes and services, enforcing user permissions, supporting network communication, and recording events.

When an application asks to read a file, send network traffic, display a window, or use memory, the operating system coordinates that request. This central role makes the operating system one of the most important places to troubleshoot performance, access, and security problems.

APPLICATIONS, PROCESSES, AND SERVICES

An application is software used to perform a task, such as a browser, spreadsheet, or security console. A process is a running instance of a program. One application can create several processes, and a process may keep running after its visible window closes.

A service is a background function that often starts automatically and runs without a user interface. Services may provide printing, updates, authentication, web hosting, logging, or many other capabilities. Linux environments may call them daemons. When a business application becomes unavailable, checking whether its supporting service is running can be more useful than reopening the user's window.

Process-management tools show CPU, memory, disk, and network activity. Windows Task Manager, Linux tools such as ps and top, and macOS Activity Monitor all help answer the same question: what is running, under which identity, and what resources is it using?

FILES, FOLDERS, AND PATHS

File systems organize data into files and directories. A path identifies a location. Windows commonly uses paths such as C:\\Users\\analyst\\Documents, while Linux and macOS use paths such as /home/analyst/Documents. File extensions may suggest a file type, but an extension is not proof that the content is safe.

Important file properties include ownership, permissions, size, timestamps, and location. Hidden files and system directories may contain configuration or application data. Do not change or delete unfamiliar files simply because they appear unusual. First identify their purpose, owner, and relationship to the reported problem.

USERS, GROUPS, AND PERMISSIONS

The operating system uses identities to decide who can read, modify, execute, or administer a resource. Permissions may be assigned directly to a user or inherited through a group. A user who can open a document but cannot edit it may have read permission without write permission.

Least privilege means giving an identity only the access required for its work. Daily activity should normally use a standard account. Administrative privileges should be used deliberately for approved tasks. If malicious software runs under an administrator account, it may be able to change far more of the system.

Never solve a permissions problem by granting broad administrative access without understanding the requirement. Confirm the user's job need, inspect current access, make the smallest approved change, and test that the intended task works.

UPDATES AND SOFTWARE INSTALLATION

Operating-system and application updates correct defects, improve reliability, and close known security weaknesses. Before an important update, confirm power, storage, compatibility, maintenance timing, backups or recovery options, and any required change approval. Afterward, verify both the update status and the business function it was meant to protect.

Install software only from trusted organizational sources. Unexpected installers, browser extensions, scripts, and macro-enabled documents can introduce risk. A signed installer and an approved software catalog provide stronger assurance than a link received in an unsolicited message.

LOGS: THE OPERATING SYSTEM'S TIMELINE

Logs record events with details such as time, source, account, action, result, and error code. System logs may show startup failures, driver problems, service stops, authentication attempts, or policy changes. Application logs provide context specific to a program. Security tools may add detections and alerts.

Logs are evidence, not automatic conclusions. A failed login can be a mistyped password, an outdated saved credential, or a malicious attempt. Look for patterns: repeated failures, unusual times, unfamiliar sources, a successful login after many failures, or activity that does not match the user's normal work.

A BASIC OS INVESTIGATION

When a service repeatedly stops:
1. Confirm the exact service and affected business function.
2. Record the failure time and any displayed error.
3. Review system and application logs around that time.
4. Check the service identity, dependencies, resource use, and recent changes.
5. Form a hypothesis supported by the evidence.
6. Apply the least disruptive approved test.
7. Verify the service remains available and record the outcome.

Restarting may restore service temporarily, but it does not explain the cause. Preserve the evidence before repeated restarts erase context or make the pattern harder to see.

APPRENTICE FIELD CHECK

A user can read a team report but cannot save changes. The correct first area to inspect is permissions and ownership—not CPU, DNS, or storage replacement. Confirm the intended access, compare the user's group membership with the file permissions, make only the approved adjustment, and verify both reading and writing.

KEY TAKEAWAYS

• The operating system manages hardware, memory, processes, services, files, identities, networking, and logs.
• A visible application, a running process, and a background service are related but different.
• Permissions should follow least privilege.
• Logs provide a timeline that helps turn symptoms into supported hypotheses.
• Validate business function and security after every approved change.`,

  "networking-fundamentals": `LEARNING OBJECTIVES

By the end of this lesson, you will be able to:
• Explain how devices communicate across local and remote networks.
• Describe the roles of switches, routers, IP addresses, DNS, DHCP, ports, and protocols.
• Trace a basic request from a workstation to a server.
• Use layered evidence to separate local, routing, name-resolution, and service failures.

NETWORKS CONNECT SYSTEMS

A network allows devices to exchange data and use shared services. A local area network connects nearby devices such as office workstations, printers, wireless access points, and servers. A wide area network connects locations over longer distances. The internet is a global collection of interconnected networks.

Mission Training City uses roads to represent communication paths. A road does not decide who may enter a building; it provides a route. Security controls placed along that route—such as firewall rules—decide which traffic is allowed. Understanding both the route and the control is essential when diagnosing connectivity or exposure.

SWITCHES, ACCESS POINTS, AND ROUTERS

A switch connects devices on the same local network and forwards frames toward the correct local destination. A wireless access point provides a radio connection into that local network. A router connects different networks and forwards packets toward remote destinations. The default gateway in a workstation's configuration is normally the router it uses when the destination is outside the local network.

If a user can reach nearby systems but not remote systems, investigate the path to the gateway and beyond. If one workstation cannot reach anything while neighboring workstations can, the problem is more likely local to that device or connection.

ADDRESSES: MAC AND IP

A network adapter has a MAC address used for communication on the local network. An IP address identifies a host's logical location so traffic can travel across networks. IPv4 addresses appear as four decimal numbers, such as 10.20.30.15. A subnet mask helps the host determine which addresses are local. The default gateway is used for remote destinations.

Addresses beginning with ranges such as 10.x.x.x, 172.16.x.x through 172.31.x.x, and 192.168.x.x are commonly used as private IPv4 addresses. Private addresses are not normally routed directly across the public internet. Organizations use routers and translation technologies to connect private networks to external services.

DHCP: AUTOMATIC CONFIGURATION

Dynamic Host Configuration Protocol provides settings such as an IP address, subnet mask, default gateway, and DNS servers. A client leases this information for a period of time. Without a valid configuration, a device may connect physically but still be unable to communicate correctly.

When only one new device fails to connect, inspect whether it received expected DHCP settings. An address that does not match the organization's range, a missing gateway, or an unexpected DNS server is useful evidence.

DNS: NAMES TO ADDRESSES

Domain Name System translates names such as portal.osiris.local into IP addresses. Humans prefer names; networks deliver packets using addresses. If a workstation can reach a server by IP address but not by hostname, basic IP connectivity is working and DNS is the stronger first hypothesis.

DNS information can be cached, so an old record may continue to point to a previous address. Check which DNS server the client is using, whether the name resolves, what address is returned, and whether that result matches the intended service.

PORTS AND PROTOCOLS

An IP address identifies a host. A port identifies a network service on that host. In the city metaphor, the IP address is the building's street address and the port is a particular door. Common examples include HTTPS on TCP port 443, DNS commonly on port 53, and SSH on TCP port 22.

A port should be open only when a required service is listening and authorized traffic needs to reach it. An open port is not automatically a vulnerability, but unnecessary public exposure increases the attack surface. Firewall and network security rules act like guards that allow or deny traffic based on source, destination, port, protocol, and direction.

THE JOURNEY OF A WEB REQUEST

When a user opens a secure website:
1. The workstation confirms its network configuration.
2. DNS resolves the hostname to an IP address.
3. The workstation determines whether the address is local or remote.
4. Remote traffic is sent to the default gateway.
5. Routers forward the packet toward the destination.
6. Firewalls evaluate whether the connection is allowed.
7. The server receives the request on the expected port.
8. The application responds, and return traffic travels back to the workstation.

A failure at any step creates different evidence. That is why “the network is down” is rarely a complete diagnosis.

A LAYERED CONNECTIVITY CHECK

Use a path from the device outward:
• Confirm power, cable, Wi-Fi association, and link state.
• Inspect the IP address, subnet mask, gateway, and DNS settings.
• Test the local interface and then the default gateway.
• Test a known remote IP address.
• Test name resolution.
• Test the target host and the required service or port.
• Compare with a working device and record each result.

Do not disable a firewall just to see whether the problem disappears unless the action is approved and safely scoped. Test the specific rule or path instead, then restore or improve the intended control.

APPRENTICE FIELD CHECK

A workstation can ping 8.8.8.8 but cannot open portal.osiris.local. The successful IP test shows the adapter, local connection, gateway, and at least one remote route are functioning. Investigate DNS configuration and resolution next. Record the configured DNS server and the result returned for the portal name.

KEY TAKEAWAYS

• Switches connect local devices; routers connect different networks.
• DHCP supplies configuration; DNS translates names into addresses.
• IP addresses identify hosts; ports identify services.
• A firewall controls the path but should not be changed without understanding the requirement.
• Test from the local device outward and let each result narrow the fault domain.`,

  "cybersecurity-fundamentals": `LEARNING OBJECTIVES

By the end of this lesson, you will be able to:
• Explain confidentiality, integrity, and availability using workplace examples.
• Distinguish assets, threats, vulnerabilities, risk, and controls.
• Describe least privilege, MFA, defense in depth, logging, and secure reporting.
• Respond safely to common phishing and malware warning signs.

WHAT CYBERSECURITY PROTECTS

Cybersecurity protects people, identities, devices, networks, applications, services, and data from unauthorized access, alteration, disruption, and destruction. The goal is not to make every system impossible to attack. The goal is to understand important assets, reduce realistic risk, detect harmful activity, respond effectively, and support the organization's mission.

THE CIA TRIAD

Confidentiality means information is available only to authorized people and systems. Payroll records exposed to an employee who does not need them represent a confidentiality failure even if no one changes the data.

Integrity means information and systems remain accurate, complete, and changed only through authorized processes. An attacker altering bank account details or an accidental script corrupting records can both damage integrity.

Availability means authorized users can access systems and data when needed. Hardware failure, ransomware, a denial-of-service attack, or an incorrect firewall change could make a critical service unavailable.

Security decisions often balance all three. Blocking every connection might protect confidentiality but destroy availability. Allowing every connection improves access but creates unacceptable exposure. Good controls preserve the required business function while reducing risk.

ASSETS, THREATS, VULNERABILITIES, AND RISK

An asset is something valuable, such as an employee account, workstation, server, application, secret, or database. A threat is a potential source of harm, including a criminal group, malicious insider, accident, hardware failure, or natural event. A vulnerability is a weakness that could be exploited, such as an unpatched service, weak password, public database, or excessive permission.

Risk considers how likely a harmful event is and how serious the impact would be. A vulnerable test computer with no sensitive data may have different risk from the same weakness on a public payroll server. Context matters: exposure, exploitability, data sensitivity, business importance, existing controls, and signs of active abuse all affect priority.

A control is a safeguard that reduces likelihood or impact. Controls can be preventive, detective, or corrective. MFA can prevent password-only access. Logging can detect and reconstruct activity. Backups can support recovery. Many controls serve more than one purpose.

IDENTITY AND LEAST PRIVILEGE

Most modern work is connected to an identity. Passwords should be long, unique, and protected by approved tools. Multi-factor authentication requires more than one type of proof, such as something you know and something you possess. MFA reduces the usefulness of a stolen password, although phishing-resistant methods are stronger than easily approved prompts.

Least privilege limits users, applications, and administrators to the access required for their tasks. Review permissions when responsibilities change, remove unused accounts, avoid shared credentials, and separate daily work from privileged administration. A compromised identity with limited access creates less damage than one with unrestricted permissions.

DEFENSE IN DEPTH

No single safeguard is perfect. Defense in depth uses several controls so one failure does not create an immediate compromise. In Open SSH Door, a restricted network rule reduces who can reach the service, SSH keys strengthen authentication, and logging gives the SOC evidence. Each control addresses a different part of the risk.

Other layers include secure configuration, updates, endpoint protection, email filtering, backups, segmentation, monitoring, incident response, and user training. Strong security is a system of controls, not a product name.

COMMON THREATS

Phishing messages try to manipulate a person into opening a malicious file, following a deceptive link, revealing credentials, sending money, or approving an unexpected MFA request. Warning signs include urgency, unusual sender domains, mismatched links, unexpected attachments, secrecy, and requests that bypass normal process.

Malware is software intended to steal, disrupt, spy, encrypt, or provide unauthorized access. Warning signs can include security alerts, unexpected processes, disabled protections, unusual network connections, file changes, or widespread performance problems. A single symptom is not proof; preserve evidence and follow the approved response process.

SAFE REPORTING AND FIRST RESPONSE

When a suspicious message or event is reported:
1. Do not open attachments, follow links, or forward the threat to coworkers.
2. Record who reported it, when it happened, and what action has already occurred.
3. Preserve the original evidence using the approved reporting method.
4. If interaction occurred, follow the organization's containment and escalation procedure.
5. Communicate clearly without blaming the user.

Do not promise that an event is harmless or declare a confirmed breach without evidence. Use accurate terms such as suspicious, blocked, observed, or under investigation.

LOGS AND MONITORING

Logs are the cameras of Mission Training City. They can record successful and failed logins, network connections, configuration changes, security detections, and application activity. Logging does not prevent every attack, but it allows defenders to detect patterns, investigate timelines, and verify whether controls worked.

Useful analysis asks who performed the action, what happened, when, where it came from, which asset was affected, whether it succeeded, and what related events occurred. Protect logs from unauthorized alteration and keep the time consistent across systems.

APPRENTICE FIELD CHECK

An internet-facing server allows SSH passwords from any address. The asset is the server and its data. A threat actor is a possible source of harm. Public exposure and weak authentication are vulnerabilities. Risk is high because unauthorized access could affect payroll operations. Restricting the network path, requiring keys, and enabling logging create defense in depth.

KEY TAKEAWAYS

• Confidentiality, integrity, and availability describe the outcomes security protects.
• Threats may exploit vulnerabilities and create risk to assets.
• Context determines priority.
• MFA, least privilege, secure configuration, and logging reduce different parts of risk.
• Preserve evidence, stay accurate, and follow authorized reporting procedures.`,

  "introduction-to-it-troubleshooting": `LEARNING OBJECTIVES

By the end of this lesson, you will be able to:
• Turn a vague report into a precise problem statement.
• Use a structured process to form and test likely causes.
• Recognize when safety, authorization, business impact, or scope requires escalation.
• Verify a solution and write useful resolution notes.

TROUBLESHOOTING IS A CONTROLLED INVESTIGATION

Troubleshooting is the process of moving from a symptom to an evidence-supported cause and a verified solution. Strong technicians do not begin by trying random fixes. They gather facts, reduce uncertainty, make the least disruptive useful test, and document what each result means.

The process is iterative. New evidence may disprove the first hypothesis and require a different one. Changing your mind when the evidence changes is a strength, not a failure.

STEP 1: IDENTIFY THE PROBLEM

Start with the user's words, then make the report precise. Ask:
• What were you trying to do?
• What happened instead?
• What exact error or behavior appeared?
• When did it begin, and does it happen every time?
• Is one user, one device, one location, or everyone affected?
• What changed recently?
• What is the business impact?

Verify or reproduce the symptom when it is safe. Record the asset, account, application, time, and scope. “The internet is broken” may become “Laptop OCA-104 can reach local printers but cannot resolve external hostnames since 9:15 AM; two nearby laptops work normally.” The second statement is far more useful.

STEP 2: ESTABLISH A THEORY

Use the evidence to list likely causes. Consider simple and recent explanations first without assuming they must be correct. A disconnected cable, full disk, expired password, stopped service, incorrect DNS setting, failed update, or changed permission can create very different symptoms.

Rank hypotheses by how well they match the evidence, how common they are, and how safely they can be tested. Separate an observed fact from a theory. “Memory use is 96 percent” is evidence. “The computer needs replacement” is a theory that the evidence does not yet prove.

STEP 3: TEST THE THEORY

Choose a test that can confirm or reject one hypothesis with minimal risk. Change one variable at a time. If several settings are changed together and the symptom disappears, you may not know which change mattered or whether a new problem was introduced.

Before making a change, consider:
• Is the action authorized for your role?
• Could it interrupt other users or a critical service?
• Could it destroy data or evidence?
• Is a backup or rollback plan required?
• Does change control or a maintenance window apply?

Record the starting condition, the action, and the result. If the theory is not confirmed, restore any temporary change when appropriate and use the new evidence to form the next hypothesis.

STEP 4: PLAN AND IMPLEMENT THE SOLUTION

Once the cause is supported, choose the smallest approved fix that addresses it. A workaround may restore service temporarily, while a root-cause solution prevents recurrence. Be clear about which one you are applying.

For changes with meaningful impact, communicate timing, expected interruption, owner approval, rollback steps, and validation criteria. Apprentices should escalate changes that exceed their access, knowledge, or authority. Escalation is not abandoning the problem; it is transferring it with enough evidence that the next person can continue efficiently.

STEP 5: VERIFY FULL FUNCTIONALITY

Retest the original symptom using the same conditions. Then check related functions and security controls. A change that restores remote access by opening a service to the entire internet is not a successful solution.

Ask the user to confirm the business task works when appropriate. Review logs or monitoring for unexpected errors. If the change involved access, verify authorized access succeeds and unauthorized access remains blocked.

STEP 6: DOCUMENT AND CLOSE

Useful resolution notes include:
• The user's report and business impact.
• The affected asset and time.
• Evidence gathered.
• Hypotheses and tests performed.
• The approved change and any rollback plan.
• Validation results.
• Final outcome and follow-up.

Avoid notes such as “fixed,” “rebooted,” or “user error.” They do not help future technicians and can damage trust. Use neutral, factual language.

WHEN TO ESCALATE

Escalate when the issue involves suspected compromise, sensitive data exposure, safety risk, broad outage, privileged access beyond your role, an irreversible action, an unfamiliar critical system, or a change requiring approval. Preserve the current evidence and explain what you have already tested.

Do not keep experimenting simply to avoid escalation. Repeated unplanned changes can increase downtime and erase evidence.

WORKED EXAMPLE: SLOW WORKSTATION

Report: A user's workstation became very slow this morning.

Identify: The slowdown begins after the browser, video meeting, and spreadsheet are open. No other users are affected. Task Manager shows 96 percent memory, 35 percent CPU, and adequate free storage.

Theory: Active applications are exhausting available RAM.

Test: Close an unneeded browser group while observing memory and responsiveness.

Result: Memory falls to 68 percent and the workstation responds normally.

Solution: Restore the user's required applications, reduce unnecessary startup and browser activity through approved settings, and discuss whether the normal workload exceeds the device's capacity.

Verify: Reopen the required workflow, confirm acceptable performance, and ensure endpoint protection remains enabled.

Document: Record the evidence, controlled test, result, final configuration, user confirmation, and any hardware follow-up.

APPRENTICE FIELD CHECK

For your next ticket, write a one-sentence problem statement before proposing a fix. Include the affected asset, exact symptom, scope, start time, and business impact. Then list one safe test and what each possible result would mean.

KEY TAKEAWAYS

• Define the problem before changing the system.
• Test one evidence-supported theory at a time.
• Protect data, service availability, and evidence.
• Escalate with context when risk or authority requires it.
• A solution is complete only after validation and useful documentation.`,
} as const;
