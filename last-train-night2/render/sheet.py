import sys,glob,os
from PIL import Image,ImageDraw
d=sys.argv[1];out=sys.argv[2];cols=int(sys.argv[3]) if len(sys.argv)>3 else 6;w=int(sys.argv[4]) if len(sys.argv)>4 else 270
fs=sorted(glob.glob(d+'/f_*.jpg'),key=lambda f:(float(os.path.basename(f)[2:-4].split('_')[0]),f))
h=w*16//9;rows=(len(fs)+cols-1)//cols;m=Image.new('RGB',(cols*w,rows*h),'black');dr=ImageDraw.Draw(m)
for i,f in enumerate(fs):
    im=Image.open(f).resize((w,h));x,y=(i%cols)*w,(i//cols)*h;m.paste(im,(x,y));dr.rectangle([x,y,x+80,y+16],fill='black');dr.text((x+3,y+2),f'{i} {os.path.basename(f)[2:-4]}',fill='yellow')
m.save(out,quality=88);print(out,len(fs))
