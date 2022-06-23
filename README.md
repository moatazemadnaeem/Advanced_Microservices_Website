# Advanced_Microservices_Website

## breif overview about the website
it is advanced e-commerce microservices 
website using next-js node-js mongo-js and express-js with authentication handling 
payments and expiration for an order all of this done with docker 
kubernetes without forget to mention testing and much more 

## Features

- Making use of next js to get the benefit from server side rendering
- Making use of microservices methodology to deliver highly performant website
- Making use of json web token to Authenticate the user 
- Skaffold the app to able it access instantly the newly changes in the code 
- Making use of nats streaming server to share data between services
- Handling concurrency issues so data get processed in the correct order
- Making use of ingress to handel routing to the services
- Making use of stripe to handel payments
- Making use of jest to handel testing 
- User can create a ticket and purchase it

## How the whole website works behind the scenes 

Lets assume that user x goes for the first time to the website

He is able to see all the tickets that are available without to be logged in

But to create update order or buy a ticket he/her must be loved in

After he make a new account he will be able to create a ticket

After creating a ticket an event will arise to indicate that a ticket was created

So orders service will listen or catch this event and save a ticket copy to its tickets collection

Then this user at some point of time wants to order a ticket what will happen

And lets imagine he wants to buy user y ticket first he must me logged in then 

He will make request to the orders service and the orders service will check if the ticket exist and then it will make sure

That the ticket is not preserved by somebody if so orders service will reject the request if not it will create a time the order first happened

Because there is an expiration service will wait a some period of time to expire the order but lets focus on the orders service again

After that orders service will create an order record with status of created and save to orders collection this order 

Will point to the ticket with some informations like the user who tries to buy the ticket ( x ) etc…

Then orders service will rise an event to payment and expiration service

The expirations service as I said it will handle the expiration for some amount of time

While doing this payment service will catch the order and save it to orders collection inside it 

Then user x will have some time to pay for the order lets imagine he payed within the time specified 

What will happen ?

In the client app there is a stripe dialog he can input his credentials after submitting the correct credentials 

A token will be generated and sent with the order id to the payment service

Then the service will take the order and check if it exist or not

And check that this order or the user that created the order is actually the user that signed in 

After that it will make sure that the order is not expired then it will charge the user with correct amount of money 

After that we will create a payment record with the order and stripe id because may be in the future we will want to fetch some charge data for any order

Then this service will rise an event indicate that everything went successfully the orders service will catch that and update the status to complete 

For the ticket 

Okay that’s good but we didn’t answer  a very import question what will happen if the user payed but after the time that specified 

The expiration service will rise an event to indicate that the order is cancelled (expiration-complete), orders service will catch that and then it will rise 

An cancelled event the payments service will catch that and then it will set the status to cancelled so if the user tries to pay for the ticket payment service will reject it.

## Installation

Open you terminal and do the following commands

```sh
mkdir ticketing
cd ticketing
git pull git@github.com:moatazemadnaeem/Advanced_Ecommerce_Website.git
```
Make sure that Docker Desktop is installed 

You can configure docker to run kubernetes its very simple and straitforward

Then you can run a commands to the cluster how that is possible ?

You can use the kubectl command for example to list all pods that running in the cluster do the following 

```sh
kubectl get pods
```
`Note: You need to build images out of the services and push it to docker hub`

To build an image do the following

```sh
cd service_name
docker build -t YOUR_DOCKER_ID/service_name .
```
`Another important Note: You need to set secrets to make sure cluster will work fine`

First secret is Json Web Token secret and to set it do the following command

```sh
kubectl create secret generic jwt-secret --from-file=JWT_KEY=Enter_Your_Secret
```

Second secret is stripe secret and to set it do the following command

```sh
kubectl create secret generic stripe-secret --from-file=STRIPE_KEY=Enter_Your_Secret
```

After that you need to open a file hosts to set port mapping what i mean by that is to map localhost to ticketing.dev 
and to do this apply the following (MacOs)

```sh
open /etc/hosts
```

then write the following 
`127.0.0.1 ticketing.dev`
After that save the file so if any request goes to localhost it will redirected to ticketing.dev

Final step is to apply all config files so you can access the website in ticketing.dev and also all the services with the latest code 

to do this it is very simple just do the following 

```sh
skaffold dev
```

### Woooh we finished i hope you understand the whole process thanks for you time (:

