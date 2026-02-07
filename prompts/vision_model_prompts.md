# Bench Press: Baseline GPT-5 image-to-text model test

### Image filepath 

/Users/chandlershortlidge/Desktop/Ironhack/fitness-form-coach/data/processed/processed-images/bench_frame_3.jpg

### Model & prompt:

GPT-5 

"""This is a frame from a bench press. Analyze the lifter's form. Look CLOSELY for problems or issues. 
  Help the user diagnose their incorrect form. Be specific about what you observe."""

### Response

Thanks for the clear frame. Based on this single image (so I can’t judge bar speed or exact touch point), here’s what looks off and how to fix it:

What I see that needs work
- Grip safety: It looks like at least the right hand is using a thumbless (“suicide”) grip and the bar is high in the fingers. Your wrists are extended back. 
  - Why it’s a problem: Higher risk of the bar rolling, plus wrist strain and power leak.
  - Fix: Wrap the thumb around the bar. Place the bar lower in the palm (over the heel of the hand, under the index–thumb “meaty” pad). Keep knuckles more vertical and stack wrist directly over elbow.

- Elbow flare: Your upper arms appear flared close to 80–90 degrees to the torso.
  - Why: Increases shoulder stress and shortens the pec/lats’ lever.
  - Fix: Tuck to roughly 45–70 degrees (scapular plane). Think “bend the bar” and “point elbows slightly toward my hips” on the way down.

- Bar path/touch zone: In this frame the bar seems positioned over the upper chest/neck line.
  - Why: Combined with flared elbows, this loads the anterior shoulder and makes you weaker off the chest.
  - Fix: Unrack over the eyes, lower to mid–lower chest (around nipple/1–2 inches below), then press back and up toward the shoulders in a gentle J-curve.

- Upper-back setup: Your shoulders look a bit “tall” rather than pinned.
  - Why: Protracted/elevated shoulders reduce chest engagement and stability.
  - Fix: Before the unrack, pull shoulder blades down and back (pin them to the bench), slight upper-back arch, chest up. Keep that scapular position the whole set.

- Forearm angle: Forearms don’t look vertical under the bar in this snapshot.
  - Why: If elbows are behind or ahead of the bar at the bottom, force isn’t transferred efficiently.
  - Fix: Adjust grip width so that at the bottom (when it touches your chest) your forearms are vertical from the side and from the front.

- Lower-body base: Hard to tell if your heels are fully planted or if you’re getting leg drive.
  - Fix: Plant feet flat, slightly behind knees, push the floor away (“toward your head”) while keeping glutes on the bench to create full-body tension.

Quick checklist for your next set
1) Set your feet and squeeze glutes.
2) Scaps down-and-back, slight arch, chest up.
3) Take a deep breath and brace.
4) Grab the bar in the palm, thumbs wrapped, wrists stacked.
5) Unrack to over your eyes, settle.
6) Lower to mid–lower chest with elbows ~45–70°.
7) Press back and up, keep scapula pinned, maintain leg drive.
8) Exhale near lockout, re-brace for the next rep.

Safety notes
- Use collars and a spotter or safety arms when possible.
- Film from a 45° front corner and a pure side view to confirm elbow angle, bar path, and forearm verticality.

If you share a short video, I can give more precise feedback on touch point, bar speed, and whether you’re losing scapular position mid-rep.




# Classification model test

GPT-4o

"""Your job is to analyze images of users working out for proper form, and list the key checkpoints of their to body evaluate. 
  Give me ONLY the bodypart checkpoints. Do NOT include evaluation suggestions. Do NOT include an intro sentence. 
  Output format should be exactly the example below.
**Example**
  Overhead press

  1. Feet & base
  2. Glutes & legs
  3. Core & Ribcage
  4. Shoulder position
  5. Bar path
  6. Head & Neck
  7. Lockout position
  8. Tempo and control
   """

   # Response 
   **Bench Press**

1. Feet & base
2. Glutes & hips
3. Back arch & position
4. Shoulder position
5. Elbow alignment
6. Wrist position
7. Bar path
8. Head & neck
9. Tempo and control


# Image response model

test_image = base_encoder("/Users/chandlershortlidge/Desktop/Ironhack/fitness-form-coach/data/processed/processed-images/bench_frame_3.jpg")

retreval_query = cleaned

results = vectorstore.similarity_search(retreval_query, k=4)
context = "\n".join([r.page_content for r in results])

llm = ChatOpenAI(model='gpt-5')

response = llm.invoke([

    {"role": "system", "content": 
     
F"""You are a world-class fitness coach. You have extensive experience in helping weight lifters achieve perfect form an maximum hypertrophy. 
Your job is to analyze images of users lifting weights, offer them advice from your context, and to answer any questions they might have. 
Inspect each image CLOSELY and Carefuly for problems or issues related to best practices in exercise form. Help the user diagnose their incorrect form. 
Be specific about what you observe.

# ANSWER CONTEXT
Use ONLY the following context when answering a user: 
     
---   
{context}
 ---
"""
     
      },

      {"role": "user", "content": 
 
[{"type": "text", "text": """ 
  """},


    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{test_image}"}}]}

])

print(response.text)

# Image response model output

Great shot—here’s what I’m seeing and how to tighten it up using our bench-press execution cues.

What I see
- Feet: Your left heel looks lifted. That breaks one of the four contact points (head, upper back, glutes, feet all planted).
- Elbows: They appear a bit flared. From the top view they’d likely be wider than the ~45° we want during the descent.
- Upper back/hips: It looks like your head, upper back, and glutes are on the bench—good. Keep them planted the whole set.
- Unracking/spotting: You’re benching without a spotter. Near maximal effort, I prefer having one to assist with the liftoff.

Fixes and cues (phase by phase)
1) Unrack
- If solo, elevate your butt slightly for the liftoff, lift the bar out (not up), then drop your hips back down before your first rep.
- Near a max, get a spotter to help lift out.

2) Brace
- Take a deep breath into your gut and hold it; if you wear a belt, press your air out against it.
- Grip the bar as hard as you can and “bend the bar” or “rip it in half” to turn on your upper back and keep everything tight.
- Plant both feet flat and keep them there.

3) Descend
- Tuck the elbows so they track about 45° relative to your torso (not flared out). Think “point my elbows slightly toward my hips” as you lower.
- Keep chest “puffed” to expand the rib cage while staying tight on the bench.

4) Press
- Maintain the breath and tight grip; keep those four contact points glued down as you drive the bar up.

Quick checklist for your next set
- Feet flat and planted before the unrack.
- Big belly breath, chest up, crush the bar, “bend the bar.”
- Elbows at ~45° on the way down.
- Head/upper back/glutes stay on the bench.

If you can, send a short top-down or front-3/4 video so I can confirm your elbow angle and make any fine-tune adjustments.



# MULTI IMAGE RESPONSE MODEL 

image_1 = base_encoder("/Users/chandlershortlidge/Desktop/Ironhack/fitness-form-coach/data/processed/processed-images/bench_frame_0.jpg")
image_2 = base_encoder("/Users/chandlershortlidge/Desktop/Ironhack/fitness-form-coach/data/processed/processed-images/bench_frame_1.jpg")
image_3 = base_encoder("/Users/chandlershortlidge/Desktop/Ironhack/fitness-form-coach/data/processed/processed-images/bench_frame_2.jpg")
image_4 = base_encoder("/Users/chandlershortlidge/Desktop/Ironhack/fitness-form-coach/data/processed/processed-images/bench_frame_3.jpg")
image_5 = base_encoder("/Users/chandlershortlidge/Desktop/Ironhack/fitness-form-coach/data/processed/processed-images/bench_frame_4.jpg")
image_6 = base_encoder("/Users/chandlershortlidge/Desktop/Ironhack/fitness-form-coach/data/processed/processed-images/bench_frame_5.jpg")
image_7 = base_encoder("/Users/chandlershortlidge/Desktop/Ironhack/fitness-form-coach/data/processed/processed-images/bench_frame_6.jpg")
image_8 = base_encoder("/Users/chandlershortlidge/Desktop/Ironhack/fitness-form-coach/data/processed/processed-images/bench_frame_7.jpg")
image_9 = base_encoder("/Users/chandlershortlidge/Desktop/Ironhack/fitness-form-coach/data/processed/processed-images/bench_frame_8.jpg")
image_10 = base_encoder("/Users/chandlershortlidge/Desktop/Ironhack/fitness-form-coach/data/processed/processed-images/bench_frame_9.jpg")


retreval_query = cleaned

results = vectorstore.similarity_search(retreval_query, k=4)
context = "\n".join([r.page_content for r in results])

llm = ChatOpenAI(model='gpt-5')

response = llm.invoke([

    {"role": "system", "content": 
     
F"""You are a world-class fitness coach. You have extensive experience in helping weight lifters achieve perfect form an maximum hypertrophy. 
Your job is to analyze images of users lifting weights, offer them advice from your context, and to answer any questions they might have. 
Inspect each image CLOSELY and Carefuly for problems or issues related to best practices in exercise form. Help the user diagnose their incorrect form. 
Be specific about what you observe.

# ANSWER CONTEXT
Use ONLY the following context when answering a user: 
     
---   
{context}
 ---
"""
     
      },

      {"role": "user", "content": 
 
[{"type": "text", "text": """ 
  """},

    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_1}"}},
    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_2}"}},
    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_3}"}},
    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_4}"}},
    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_5}"}},
    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_6}"}},
    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_7}"}},
    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_8}"}},
    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_9}"}},
    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_10}"}}
    
    
    ]}

])

print(response.text)

# RESPONSE

Thanks for the clips—here’s what I’m seeing and how to fix it so your bench is tighter and safer.

What I notice
- Wrists are extended and the bar sits toward your fingers. Your forearm isn’t stacked under the bar at the bottom.
- Elbows flare wide on the way down (closer to your shoulders than your torso).
- You look at the bar during the rep. Your gaze changes as the bar moves.
- Upper back doesn’t look fully “set,” and your feet don’t look firmly driving into the floor every rep.
- Bar path looks mostly straight up/down. At lockout the bar isn’t clearly over the shoulder joint line before you descend.

Quick fixes (use these cues next session)
1) Grip/wrist and forearm stack
   - Place the bar on the heel of your palm, directly over the forearm bones. Squeeze hard and “bend the bar/rip it in half.”
   - Slightly pronate and internally rotate your arms so the forearm stays vertical when the bar touches your chest. Adjust grip width so your forearm is vertical at the bottom.

2) Elbow angle on the descent
   - Drop your elbows to roughly 45 degrees relative to your torso on the way down. This will line up the vertical forearm at the chest touch.

3) Upper back and setup tightness
   - Pinch your shoulder blades together and plant your upper back into the bench as your platform.
   - Establish four points of contact: head, upper back, glutes, and feet all firmly planted.

4) Eyes/bar path
   - At unrack, move the bar to a position directly over your shoulder joints at lockout. Pick a spot on the ceiling there and stare at it the whole set—don’t watch the bar.
   - Lower to your chest, touch without stopping, then drive the bar back toward that ceiling spot—think “throw it back” to create the slight upside‑down J path.

5) Brace and leg drive
   - Big breath into your gut, chest up. As the bar touches, tighten your glutes and drive your feet into the floor to start the press.

Unrack/rack
- If unracking alone, lift out (not up), then drop your hips once you’ve cleared the hooks. After the last rep, lock the elbows, move back to the rack, and have a spotter cover if possible.

Drill to lock it in
- Do 2 sets of 5 with a lighter load focusing only on: fixed eye spot, vertical forearms at chest touch, and the upside‑down J path back to that ceiling point.

Want me to check your grip width and elbow angle with a close‑up photo at the bottom position? If your wrists or shoulders feel stressed, tell me where and I’ll fine‑tune the cues.

# CONTENT & SOURCES

==Results 1==
at the ceiling, unlock your elbows, lower the bar to your chest, touch without
stopping, and then drive the bar back at the point on the ceiling your eyes have
trapped. Try it for a set of five reps. You'll immediately notice that if your
eyes don't move from their fixed position, the bar will go to the same place
every rep. Do another set of five with the bar, reinforcing your eye position,
and then rack the bar. This is done with locked elbows after the last rep is
finished. Should you have a spotter, this movement back to the rack should be
covered. Now that we've covered the basic movement pattern for the bench press,
we can maximize the efficiency of the lift by improving the position of the
upper back, legs, and feet. The upper back needs to be planted firmly against
the bench and used as a platform to drive against while the arms drive the bar
up. When this is done correctly, the shoulder blades will be adducted or pinched
together. Sit on the bench in the same position you
{'exercise_type': 'bench_Press', 'video_id': 'rxD321l2svE', 'title': 'Learning to Bench Press | The Starting Strength Method', 'author': 'Mark Rippetoe', 'difficulty': 'advanced'}


==Results 2==
We've got the bench press setup down; now it's time to execute the set. We'll
break the execution into four phases: unrack, brace, descend, and press. First,
unrack the bar with your spotter's help, lifting out, not up, or, if unracking
by yourself, keep your butt elevated for the liftoff component, then drop your
hips once you've unracked. I prefer having a spotter near a maximal effort to
help with the liftoff. Ensure you have four main points of contact: your head,
upper back, glutes, and feet should all be planted. In position, take a deep
breath into your gut, pressing the air out against your belt if you have one.
You can cue yourself to puff your chest out to expand the rib cage as much as
possible. Grip the bar as hard as you can. You can optionally use the cue to
bend the bar or rip it in half, activating your upper back muscles to maintain
tightness. During the descent, drop your elbows at a 45-degree angle relative to
your torso when viewed from the top. There's unanimous
{'exercise_type': 'bench_press', 'title': 'How To Get A Huge Bench Press with Perfect Technique', 'video_id': 'vcBig73ojpE', 'difficulty': 'intermediate', 'author': 'Jeff Nippard'}


==Results 3==
Once you've touched the bar to your chest, you want to initiate the upward
movement by tightening your glutes and driving your legs into the ground. This
may seem like a strange cue, but just like on squat and deadlift, using leg
drive is going to enable you to use more weight and stay tighter. Now, on the
bench press, because our feet are not directly under the bar, it's not as
important as it is on squats and deadlifts. But we're still trying to get every
little bit of efficiency that we can out of our movement. As you start to press
up, you want to think about throwing the bar back as you start the lockout
process. Remember, we're pressing the bar in an upside-down J path. Ideally,
we'd have a completely straight bar path, but with most people on the bench
press, that's not going to be possible. If they do, the bar ends up too far away
from you as you lock out and creates extra torque on your shoulders.
{'difficulty': 'beginner', 'title': "How To Bench Press: Layne Norton's Complete Guide", 'exercise_type': 'bench_press', 'video_id': 'esQi683XR44', 'author': 'Layne Norton'}


==Results 4==
result in a vertical forearm for most people when the bar is touching the chest
at the bottom. The bar should rest on the heel of your palm, not on the fingers,
and directly over the bones of the forearm. Just like the press, this grip is
best accomplished by pronating your hands with a slight internal rotation of
your arms. You are now ready to take the bar out of the rack. Look directly up
at the ceiling and push up on the bar, locking out your elbows. Move the bar out
to a position directly over the line of your shoulder joints. This is the place
where the bar is in balance at lockout. Note carefully the position of the bar
against the ceiling; this picture is your reference for the path the bar will
take as you move it down and up. You will lower the bar to your chest, touch the
chest, and then drive the bar right back to the exact position you are looking
at on the ceiling overhead. Stare at the place on the ceiling where the bar is
to go; do not watch the bar as it moves. With
{'video_id': 'rxD321l2svE', 'title': 'Learning to Bench Press | The Starting Strength Method', 'exercise_type': 'bench_Press', 'author': 'Mark Rippetoe', 'difficulty': 'advanced'