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

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/bcc0241a-cbc1-4b02-b895-04b351c510b6)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/faf933b2-b008-4b26-a1ab-52d59f9f07f7)



1. Creating Dockerfile:

In the root directory of my Node.js application, created a file named Dockerfile to build and run my docker image.

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/edd069d0-ae14-405e-adba-249f2ae3d024)

After creating the Dockerfile, i tried to build and run your Docker image with the following commands:

docker build -t zarifa003/ansibletask:0.0.1 .

docker container run -d -p 3000:5000 zarifa003/ansibletask:0.0.1

Then i pushed docker image to docker hub.

docker push zarifa003/ansibletask:0.0.1
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/9c114bf5-82da-49a6-b913-cd6cbc0c4241)


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
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/db1f0aec-374e-45ab-bce9-12156b15be46)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/b38ffa88-f50f-437d-9575-e13ea81515be)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/24bc75ce-772f-4bdf-b3c7-d27b90daf81e)

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/420152ae-97bf-4ccb-b995-7a40faf4efae)
1. Then I tried to create an EC2 instance as part of my web-application role. 
- In the tasks directory of my web-application role, i created main.yml file. I used Ansible Vault to encrypt aws credentials:

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/2cb4348d-71a4-444b-ae2c-45f213104db7)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/89cea0a9-a085-491f-8e5e-06cd433212e7)


I added to my vault.yml file with:

ansible-vault create vault.yml

aws_access_key: ACCESS_KEY
aws_secret_key: SECRET_KEY
ansible-playbook -C main.yml —ask-vault-pass

Note: I created vault.yml file with secret credentials for web application at the end, that is why some roles do not include --ask-vault-pass in their execution.

I have created to separate instances one for hosting Database server and one for hosting Docker Container:
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/dd4c1101-6e8c-4500-9f68-da5551f6e2de)


1. ****Updating Inventory File with Correct SSH Details****

For the next step, I ensured to run the playbook with the correct inventory file that includes the EC2 instances.

ansible-playbook playbook.yml -i hosts
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/e18c1597-5ada-41e2-a269-c84f2dd2518e)

6. Here I changed hosts : localhost to hosts : ec2_instances to run the docker container in EC2 instance:
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/72b07218-18d2-4908-a5f9-a91bfd632aed)

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/d0189c08-fd55-4a69-822f-3d9d4b7f69b1)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/c0ee2b1b-0712-4740-a839-a84416361b41)

1. **Database Role:**

Install and configure the database server (MySQL/PostgreSQL).

Create a new database and user with privileges.

As I mentioned earlier, I have two instances one for hosting database server and one for hosting docker container.

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/0a259a1f-436e-4762-9a5f-aef43efea5a1)

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/729fbc16-882c-4238-8b3e-5ac5a8b42e94)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/b7c71120-07c9-4b75-af0c-5a0fbbf0c5d7)

As it’s best practice not to use the root user for application connections, I created a new user and granted the necessary privileges to my new user for the database:

GRANT ALL PRIVILEGES ON ansibletask.* TO 'zarifa'@'%' IDENTIFIED BY 'zarifa';
FLUSH PRIVILEGES;

GRANT ALL PRIVILEGES ON ansibletask.* TO 'root'@'ip-172-31-21-192.eu-north-1.compute.internal' IDENTIFIED BY 'root';
FLUSH PRIVILEGES;
 ***Final Result**
 So, web application server and database server is up and database connection is successfully established: 
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/510f04e8-c0b6-4e28-b401-4fc1d02a1cc1)

![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/ed9b1c9a-59c1-4a87-ac3c-c089ae1f459f)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/5efa525c-e73d-4a8a-8e44-8346f5f16d37)
![image](https://github.com/Zarifa003/AnsibleTask/assets/94198223/c3960509-5624-4200-a2b6-26bdb3eca988)

***Summary:***

I deployed Custom Docker Container and Started Database server in AWS separate instances and established connection between them. 

ansible-playbook build_docker_image.yml -i /etc/ansible/hosts - to deploy docker container in EC2 instance

sudo ansible-playbook playbook.yml -i /etc/ansible/hosts -to Initialize MariaDB service in Database instance

http://13.53.170.100:3000/form.html

[http://13.53.170.100:3000/](http://13.53.170.100:3000/form.html)


