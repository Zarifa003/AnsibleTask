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


1. **Creating Role for Setting Up the Database and Web application server**

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

ansible-playbook playbook.yml --ask-vault-pass

1. **Docker Image Build:**.

Use Ansible to automate the building of the Docker image:
Firstly, I tried to pull Docker image and run Docker container in localhost, to make sure it does not contain any problems. In the build_docker_image.yml you can see below successfully pulls the custom Docker image and runs the container. 
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/a6e81c91-976d-4f44-a4ac-23e7a252f81f)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/d1163bf8-6f8d-41af-a0b2-4912728e3548)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/dbd93ef3-b891-4984-8594-67bbe1d06e72)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/2679c01f-7897-4d8b-847b-a47c826cfdb9)

1. Then I tried to create an EC2 instance as part of my web-application role. 
- In the tasks directory of my web-application role, i created main.yml file. I used Ansible Vault to encrypt aws credentials:

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/5b4a5c8e-f225-45ae-8ec6-9a5f7db3608c)

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/dc93e779-5442-4b4e-a3d7-ade5cb023dd4)

I added to my vault.yml file with:

ansible-vault create vault.yml

aws_access_key: ACCESS_KEY
aws_secret_key: SECRET_KEY
ansible-playbook -C main.yml —ask-vault-pass

Note: I created vault.yml file with secret credentials for web application at the end, that is why some roles do not include --ask-vault-pass in their execution.

1. ****Updating Inventory File with Correct SSH Details****

For the next step, I ensured to run the playbook with the correct inventory file that includes the EC2 instance.

ansible-playbook playbook.yml -i hosts

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/5267204d-6c10-4b7a-917c-b646deb4d75f)


6. Here I changed hosts : localhost to hosts : ec2_instances to run the docker container in instance:
 ![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/126a3913-9f74-456d-9a15-1a6efa692450)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/fd9020d9-b7be-4a0a-9aea-2b382c9cd68c)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/baead6d6-895a-4d34-88b6-575c74975369)

1. **Database Role:**

Install and configure the database server (MySQL/PostgreSQL).

Create a new database and user with privileges.

I created mysql.yml in database-server role’s tasks directory. Again, added secret credentials in vault.yml file and run ‘sudo ansible-playbook mysql.yml --ask-vault-pass’ command.
