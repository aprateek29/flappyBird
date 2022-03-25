import Matter from 'matter-js';
import React from 'react';
import {Image} from 'react-native';
import bird from './bird.png';

const Bird = props => {
  const widthBody = props.body.bounds.max.x - props.body.bounds.min.x + 20;
  const heightBody = props.body.bounds.max.y - props.body.bounds.min.y + 4;

  const xBody = props.body.position.x - widthBody / 2;
  const yBody = props.body.position.y - heightBody / 2;

  const color = props.color;

  return (
    <Image
      style={{
        position: 'absolute',
        left: xBody,
        top: yBody,
        width: widthBody,
        height: heightBody,
      }}
      source={bird}
    />
  );
};

export default (world, color, pos, size) => {
  const initialBird = Matter.Bodies.rectangle(
    pos.x,
    pos.y,
    size.width,
    size.height,
    {label: 'Bird'},
  );
  Matter.World.add(world, initialBird);

  return {
    body: initialBird,
    color,
    pos,
    renderer: <Bird />,
  };
};
