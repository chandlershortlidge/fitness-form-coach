# Bench Press: Baseline GPT-5 image-to-text model test

### Image filepath 

/Users/chandlershortlidge/Desktop/Ironhack/fitness-form-coach/data/processed/processed-images/bench_frame_3.jpg

### Model & prompt:

GPT-5 

"""This is a frame from a bench press. Analyze the lifter's form and compare it to your context. Look CLOSELY for problems or issues. 
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



