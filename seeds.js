const mongoose = require("mongoose");
const Post = require("./models/post");
const Comment = require("./models/comment");

const data = [
    {
        name: "kumar parwat", 
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Kumar_Parvat_StageOne.jpg/1024px-Kumar_Parvat_StageOne.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pulvinar bibendum dolor ac ornare. In rutrum facilisis augue, a accumsan eros ultricies egestas. Etiam varius massa mollis lacus bibendum ultrices. Quisque ut neque tortor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla vel volutpat tellus. Praesent venenatis sodales erat sit amet suscipit. Aliquam fermentum feugiat neque sit amet porta. Duis cursus tempor ultrices. Aliquam viverra sed arcu at commodo.Cras placerat, ex nec finibus imperdiet, nulla ante ornare lorem, a mollis ex justo quis nulla. Aenean mattis sollicitudin massa eget sodales. Quisque gravida orci arcu, vel mollis nisl scelerisque vel. Proin dapibus ex nec massa tincidunt molestie. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras laoreet fermentum odio vel ultrices. Praesent convallis posuere dolor, ut gravida nulla gravida et. Vestibulum fringilla nisl vel mauris facilisis congue. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
        name: "Mysore Palace", 
        image: "https://live.staticflickr.com/5668/30439447673_9c02a50a75_b.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pulvinar bibendum dolor ac ornare. In rutrum facilisis augue, a accumsan eros ultricies egestas. Etiam varius massa mollis lacus bibendum ultrices. Quisque ut neque tortor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla vel volutpat tellus. Praesent venenatis sodales erat sit amet suscipit. Aliquam fermentum feugiat neque sit amet porta. Duis cursus tempor ultrices. Aliquam viverra sed arcu at commodo.Cras placerat, ex nec finibus imperdiet, nulla ante ornare lorem, a mollis ex justo quis nulla. Aenean mattis sollicitudin massa eget sodales. Quisque gravida orci arcu, vel mollis nisl scelerisque vel. Proin dapibus ex nec massa tincidunt molestie. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras laoreet fermentum odio vel ultrices. Praesent convallis posuere dolor, ut gravida nulla gravida et. Vestibulum fringilla nisl vel mauris facilisis congue. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
        name: "Chamundi Hills", 
        image: "https://cdn.s3waas.gov.in/s30d3180d672e08b4c5312dcdafdf6ef36/uploads/bfi_thumb/2018091770-olw6vyevi41pjef7uljbpbz8haauzbj4c1zdatmb2i.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pulvinar bibendum dolor ac ornare. In rutrum facilisis augue, a accumsan eros ultricies egestas. Etiam varius massa mollis lacus bibendum ultrices. Quisque ut neque tortor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla vel volutpat tellus. Praesent venenatis sodales erat sit amet suscipit. Aliquam fermentum feugiat neque sit amet porta. Duis cursus tempor ultrices. Aliquam viverra sed arcu at commodo.Cras placerat, ex nec finibus imperdiet, nulla ante ornare lorem, a mollis ex justo quis nulla. Aenean mattis sollicitudin massa eget sodales. Quisque gravida orci arcu, vel mollis nisl scelerisque vel. Proin dapibus ex nec massa tincidunt molestie. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras laoreet fermentum odio vel ultrices. Praesent convallis posuere dolor, ut gravida nulla gravida et. Vestibulum fringilla nisl vel mauris facilisis congue. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    }    
]

function seedDB(){
    //Remove all posts
    Post.deleteMany({}, (err)=>{
        if(err){
            console.log(err);
        } else{
            console.log("removed posts!");
            //add a few posts
            data.forEach((seed)=>{
                Post.create(seed, (err,post)=>{
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a post");
                        //add a few comments
                        Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Gulshan"
                        }, (err, comment)=>{
                            if(err){
                                console.log(err);
                            } else{
                                    post.comments.push(comment);
                                    post.save();
                                    console.log("Created new comment");
                            }
                        });
                    }
                });
            });
        }
    });
    
    
}

module.exports = seedDB;