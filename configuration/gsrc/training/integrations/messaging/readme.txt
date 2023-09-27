
Safe Ordering:
	Event is triggered on top of any primary entity.
	The messages of a particular event will be sent sequentially (means wait for acknodwledgement)

Non Safe Ordering:
	Event will be triggred without waiting for ack.
	In message COnfig -
		Multitreaded ---- Multiple threads will be processing, and doesnt wait for acknodwledge
		Single threaded - Only one thread will be processing, but doesnot wait for acknodwledge
		Strict ---------- This is how we make non primary entities as Safe ordering. Now ony one thread will be executing the process and it waits for the Ack.


Message - Lease Expired
	Message, Batch and Startable plugins acquires a lease to use the database.
	If the no available lease are there at the moment, then the application needs to wait to get a lease.

Message Table Time Columns
	CreationTime	    : The creation time of the message record. At this point, the entity (root or primary) is already locked. Thus, the step does not add additional wait time to the lock/release cycle.
	BeforeSendLockTime	: The time when the MessageRequest plugin requests a lock on this message record for payload generation.
	BeforeSendLockedTime: The time when the MessageRequest plugin acquires the record lock and is ready to perform payload generation. If there is an extensive amount of time spent at this step, it is due to the locking operation.
	BeforeSendTime	    : The time between payload generation and updating the message record in the database. If there is an extensive amount of time spent at this step, it is due to volume of message, coding issues, or issues with external integration.
	QueryTime			: The time when the MessageTransport plugin queries the database for the record (cc_Message). In table cc_MessageHistory, this value is always NULL.
	SendLockTime	    : The time when the MessageTransport plugin requests a lock of the message record for the Message.send method call.
	SendLockedTime	    : The time when the MessageTransport plugin acquires the record lock and is ready to perform the Message.send method call. If there is an extensive amount of time spent at this step it is due to the locking operation.
	SendTime	        : The time after the Message.send method call completes and the message exits the MessageTransport plugin. If there is an extensive amount of time spent at this step, it is due to volume of message, coding issues, or issues with external integration.
	AfterSendTime	    : The time after the Message.afterSend method call completes and the message exits the MessageTransport plugin.
	AckedTime	        : The time after the Message.ackMessage method call completes and the reply message exits the MessageReply plugin.
	RetryTime	        : Stores the time scheduled (in the future) to retry sending the message record.
