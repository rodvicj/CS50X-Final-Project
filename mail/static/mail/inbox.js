document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));

  // added event listender for compose button
  document.querySelector('#compose').onclick = compose_email;

  // function for sending an email
  document.querySelector('#compose-form').onsubmit = function() {
    send_mail();
    return false;
  };

  // load emails in inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#compose-header').innerHTML = 'New Email';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  document.querySelector('#compose-recipients').focus();

}

async function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  const main_container = document.createElement('div');
  main_container.id = 'main_container';

  // Get new posts and add posts
  await fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(data => {
      data.forEach(email => {
        const email_container = document.createElement('div');
        const sub_container = document.createElement('div');
        sub_container.className = 'sub_container';

        // added email.id as dataset property data-email_id
        email_container.setAttribute('data-email_id', email.id);

        // create div's
        const sender = document.createElement('div');
        const subject = document.createElement('div');
        const timestamp = document.createElement('div');

        // assigning emails properties to its corresponding container
        sender.innerHTML = email.sender;
        subject.innerHTML = email.subject;
        timestamp.innerHTML = email.timestamp;

        // if email is already opened once, change background to gray
        if (email.read === true) {
          email_container.style.background = "gray";
        }

        email_container.append(sender);
        email_container.append(subject);
        email_container.append(timestamp);

        // added event handler to call get_mail when container is clicked
        email_container.addEventListener('click', () => get_mail(email.id, mailbox));

        sub_container.append(email_container);
        main_container.append(sub_container);
      });
    });
  // Render the emeails to the DOM
  document.querySelector('#emails-view').append(main_container);
}

function get_mail(email_id, mailbox) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail-view').innerHTML = '';
  document.querySelector('#mail-view').style.display = 'flex';

  fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';

      const view_email_container = document.createElement('div');
      const sender = document.createElement('div');
      const recipients = document.createElement('div');
      const sender_recipients_container = document.createElement('div');
      const timestamp = document.createElement('div');
      const email_body = document.createElement('div');
      const email_heading = document.createElement('div');

      view_email_container.id = 'view_email_container';
      sender_recipients_container.id = 'sender_recipients_container';
      timestamp.id = 'timestamp';
      email_heading.id = 'email_heading';
      sender.innerHTML = `sender: <b>${email.sender}</b>`;

      if (email.recipients.length === 1) {
        recipients.innerHTML = ` recipient: <b>${email.recipients}</b>`;
      } else {
        recipients.innerHTML = `recipients: <b>${email.recipients.join(', ')}`;
      }

      timestamp.innerHTML = email.timestamp;
      sender_recipients_container.append(sender);
      sender_recipients_container.append(recipients);
      email_heading.append(sender_recipients_container);
      email_heading.append(timestamp);

      email_body.innerHTML = email.body;
      email_body.id = 'view_email_body';

      const view_email_sub_container = document.createElement('div');
      view_email_sub_container.id = 'view_email_sub_container';

      view_email_sub_container.append(email_heading);
      view_email_sub_container.append(email_body);
      view_email_container.append(view_email_sub_container);

      const archiveContainer = document.createElement('div');
      archiveContainer.id = 'archiveContainer';
      const buttonContainer = document.createElement('div');
      archiveContainer.innerHTML = `<h3>${email.subject.charAt(0).toUpperCase() + email.subject.slice(1)}</h3>`;

        if (mailbox === 'inbox') {
          buttonContainer.innerHTML = `<button id="reply" class="btn btn-outline-primary">Reply</button>`;
          archiveContainer.innerHTML += `<button id="archive" class="btn btn-outline-secondary">Archive</button>`;
          buttonContainer.addEventListener('click', () => reply_mail(email));
          archiveContainer.addEventListener('click', () => archive_mail("archive", email.id));
        } else if (mailbox === 'archive') {
          archiveContainer.innerHTML += `<button id="unarchive" class="btn btn-outline-secondary">Unarchive</button>`;
          archiveContainer.addEventListener('click', () => archive_mail("unarchive", email.id));
          buttonContainer.innerHTML = '';
      }

      document.querySelector('#mail-view').append(archiveContainer);
      document.querySelector('#mail-view').append(view_email_container);
      document.querySelector('#mail-view').append(buttonContainer);

      if (email.read !== true) {
        fetch(`/emails/${email_id}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
          })
        })
      }
    });
}

function send_mail() {
  const subject = document.querySelector('#compose-subject').value;
  const recipients = document.querySelector('#compose-recipients').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: `${recipients}`,
      subject: `${subject}`,
      body: `${body}`
    })
  })
    .then(response => response.json())
    .then(result => {
      if (result.error !== undefined) {
        console.log(result.error);
        alert(result.error);
      } else if (result.message !== undefined) {
        console.log(result);

        setTimeout(() => {
          load_mailbox('sent');
        }, 10);
      }
    })
    .catch(error => {
      console.log('error:', error);
    });
}

async function archive_mail(method, email_id) {
  if (method === 'archive') {
  await fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
  });
  } else if (method === 'unarchive') {
    await fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: false
      })
    });
  }
  load_mailbox('inbox');
}

function reply_mail(email) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#mail-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#compose-header').innerHTML = 'Reply';
  document.querySelector('#compose-recipients').value = `${email.sender}`;
  const compose_subject = document.querySelector('#compose-subject');

  if ((email.subject[0] === 'r') && (email.subject[1] === 'e') && (email.subject[2] === ':')) {
    compose_subject.value = `${email.subject}`;
  } else {
    compose_subject.value = `re: ${email.subject}`;
  }
  document.querySelector('#compose-body').value = `\n\nOn ${email.timestamp} ${email.sender} wrote:\n${email.body}`;
  document.querySelector('#compose-body').focus();
  document.querySelector('#compose-body').setSelectionRange(0, 0);
}

