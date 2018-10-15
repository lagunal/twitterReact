<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username', 'email', 'password',
    ];
    
    protected $appends = ['avatar'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    //relationsship to table posts
    public function posts() {
        return $this->hasMany(Post::class);
    }

    public function getAvatar() {
        return "https://gravatar.com/avatar/" . md5($this->email) . "/?s=45&d=mm";
    }

    public function getAvatarAttribute() {
        return $this->getAvatar();
    }

    public function getRouteKeyName() {
        return 'username';
    }
    
    // verify user is not the current user id
    public function isNotTheUser(User $user) {
        return $this->id !== $user->id;
    }

    //verify is user is followig a user
    public function isFollowing(User $user) {
        return (bool) $this->following->where('id', $user->id)->count();
    }

    //verify is user can follow a user
    public function canFollow(User $user) {
        if (!$this->isNotTheUser($user)) {
            return false;
        }
        return !$this->isFollowing($user);
    }

    //verify is user can unfollow a user
    public function canUnfollow(User $user) {
        return $this->isFollowing($user);
    }

    //relationship with table follows
    public function following() {
        return $this->belongsToMany('App\User', 'follows', 'user_id', 'follower_id');
    }
    public function followers() {
        return $this->belongsToMany('App\User', 'follows', 'follower_id', 'user_id');
    }


}
