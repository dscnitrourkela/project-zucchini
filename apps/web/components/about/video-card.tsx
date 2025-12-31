import Lines from "@/components/ui/lines";

export default function VideoCard({
  length,
}: {
  length: {
    1: number;
    2: number;
    3: number;
  };
}) {
  const { 1: length1, 2: length2, 3: length3 } = length;
  const url = "https://www.youtube.com/embed/tf1e1E3EwZE";
  return (
    <div className=" flex flex-col items-center  w-lg lmd:w-md llg:w-[32rem] gap-2">
      <div className="w-full relative">
        <div className="absolute -top-12 z-10 lsm:block hidden">
          <Lines length={length1} direction="horizontal" flowDirection="rtl" />
        </div>
        <div className="absolute -top-8 z-10 lsm:block hidden">
          <Lines length={length2} direction="horizontal" flowDirection="rtl" />
        </div>
        <div className="absolute -top-4 z-10 lsm:block hidden">
          <Lines length={length3} direction="horizontal" flowDirection="rtl" />
        </div>
        <div className="absolute -bottom-12 right-0 z-10 lsm:block hidden">
          <Lines length={length1} direction="horizontal" flowDirection="ltr" />
        </div>
        <div className="absolute -bottom-8 right-0 z-10 lsm:block hidden">
          <Lines length={length2} direction="horizontal" flowDirection="ltr" />
        </div>
        <div className="absolute -bottom-4 right-0 z-10 lsm:block hidden">
          <Lines length={length3} direction="horizontal" flowDirection="ltr" />
        </div>
        <div className="video-card-body relative w-full aspect-video overflow-hidden">
          <iframe
            className="w-full h-full outline-none border-none -z-10 absolute"
            src={url}
            title="NITRUTSAV Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
