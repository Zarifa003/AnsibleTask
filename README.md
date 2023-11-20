# Ansible task

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

I have created to separate instances one for hosting Database server and one for hosting Docker Container:

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/80bc61cb-80e9-4f0b-87a3-778223996083)

1. ****Updating Inventory File with Correct SSH Details****

For the next step, I ensured to run the playbook with the correct inventory file that includes the EC2 instances.

ansible-playbook playbook.yml -i hosts

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/5267204d-6c10-4b7a-917c-b646deb4d75f)


6. Here I changed hosts : localhost to hosts : ec2_instances to run the docker container in EC2 instance:
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/ce6da003-3da6-44e6-aa7e-85766747aaa2)

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/fd9020d9-b7be-4a0a-9aea-2b382c9cd68c)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/127f8062-468d-4162-a862-fe02af5c2c87)


1. **Database Role:**

Install and configure the database server (MySQL/PostgreSQL).

Create a new database and user with privileges.

As I mentioned earlier, I have two instances one for hosting database server and one for hosting docker container.
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/ac0b0d5c-4509-4c55-a743-b5f9958eefec)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/8a2e5ac8-f0c0-4da2-ba0a-741ce9cf5eb1)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/47d69c3c-248f-4138-988f-6900341fa9bb)

As it’s best practice not to use the root user for application connections, I created a new user and granted the necessary privileges to my new user for the database:

GRANT ALL PRIVILEGES ON ansibletask.* TO 'zarifa'@'%' IDENTIFIED BY 'zarifa';
FLUSH PRIVILEGES;

GRANT ALL PRIVILEGES ON ansibletask.* TO 'root'@'ip-172-31-21-192.eu-north-1.compute.internal' IDENTIFIED BY 'root';
FLUSH PRIVILEGES;
 ***Final Result**
 So, web application server and database server is up and database connection is successfully established: 
 ![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/6b42cd4d-bafb-464f-bb4a-9a03615fc8a9)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/1695625f-e86a-44cb-afb8-78d4ed3ce73a)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/4f9b9684-b73f-42cb-8f62-a507f5bdbf5e)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/0c90f69b-bf51-4399-824e-7ebd86d931c6)

***Summary:***

I deployed Custom Docker Container and Started Database server in AWS separate instances and established connection between them. 

ansible-playbook build_docker_image.yml -i /etc/ansible/hosts - to deploy docker container in EC2 instance

sudo ansible-playbook playbook.yml -i /etc/ansible/hosts -to Initialize MariaDB service in Database instance

http://13.53.170.100:3000/form.html

[http://13.53.170.100:3000/](http://13.53.170.100:3000/form.html)


