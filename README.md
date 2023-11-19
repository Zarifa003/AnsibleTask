# devops

**Ansible Project: Deploy a Web Application with a Database Backend**

1. **Backend**: A Node.js server with Express.js for HTTP requests
2. **Database**: MySQL for storing data
3. **Frontend**: HTML form for the POST request and a simple page to display data from a GET request.

### **Prerequisites**

- Node.js
- MySQL

I wrote simple CRUD application in node.js with POST and GET requests and MySQL connection.

Then, started the MySQL server and ensured it is running. Runned ‘node server.js’, Opened a web browser and go to http://localhost:3000/index.html and [http://localhost:3000/](http://localhost:3000/index.html)form.html to view data.

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/025e0956-44f6-423f-9df3-0a30eca224cf)

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/1720592b-b432-4347-b355-e64da5dd243f)


1. Creating Dockerfile:

In the root directory of my Node.js application, created a file named Dockerfile to build and run my docker image.

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/c02df058-e94a-49e6-98b3-1bf817fbd1dd)


After creating the Dockerfile, i tried to build and run your Docker image with the following commands:

docker build -t zarifa003/ansibletask:0.0.1 .

docker container run -d -p 3000:5000 zarifa003/ansibletask:0.0.1

Then i pushed docker image to docker hub.

docker push zarifa003/ansibletask:0.0.1
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/b5f27522-96dc-47f3-ab29-87a66db632d1)


1. **Role for Setting Up the Database and Web application server**

In my Ansible project directory, created a new role for the database and web-application:

ansible-galaxy init database-server

ansible-galaxy init web-application

and to store sensitive data like database passwords, AWS secret keys i created vault.yml:

ansible-vault create vault.yml

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/ba4fe190-d798-4195-93cb-895d9a2c2aae)
 I created two separate files for each role: 
 Kept mysql sensitivte data in vault.yml in database-server/tasks/vault.yml
 and AWS secret key and ID in web-application/tasks/vault.yml

And Executed playbook with —ask-vault-pass:

ansible-playbook main.yml --ask-vault-pass

1. **Docker Image Build:**.

Use Ansible to automate the building of the Docker image

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/5d0ff410-e541-426b-9b51-96fc966a1a5e)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/0d1c26be-e9d4-4ced-9da6-c346d4629b9f)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/e6fe472c-a098-4fa6-a6a9-e83fb6c9ff77)


1. Then I tried to create an EC2 instance as part of my web-application role. 
- In the t**asks** directory of my web-application role, i created main.yml file. I used Ansible Vault to encrypt aws credentials:

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/5b4a5c8e-f225-45ae-8ec6-9a5f7db3608c)

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/dc93e779-5442-4b4e-a3d7-ade5cb023dd4)

I added to my vault.yml file with:

ansible-vault create vault.yml

aws_access_key: ACCESS_KEY
aws_secret_key: SECRET_KEY

1. ****Updating Inventory File with Correct SSH Details****

For the next step, I ensured to run the playbook with the correct inventory file that includes the EC2 instance.

ansible-playbook playbook.yml -i hosts

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/2da8502d-9c42-4689-8ff3-d2c9f925271f)

1. ****Install Node.js on the EC2 Instance****

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/0516c9de-9e0a-4e82-96a8-ca0707b11492)

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/b07f2ef3-4814-495e-9ad2-1dde045f6f32)

Here, I replaced Replace ec2_instances with the group name of my target host in the inventory.
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/b1b9097c-c564-4a91-bf89-1da1a6ee74eb)

1. Then I tried to transfer my Node.js application code to the EC2 instance and start the Node.js application.

ansible-playbook deploy_app.yml -i hosts:
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/cbc1b4ce-1745-440a-af8d-8a0011c16002)


1. **Database Role:**

Install and configure the database server (MySQL/PostgreSQL).

Create a new database and user with privileges.

I created mysql.yml in database-server role’s tasks directory. Again, added secret credentials in vault.yml file and run ‘sudo ansible-playbook mysql.yml --ask-vault-pass’ command.
